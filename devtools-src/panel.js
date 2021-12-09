
function DeleteAllResults(){
    let oldBody = document.getElementById("resultsTableBody");
    let newBody = document.createElement("tbody");
    newBody.id = "resultsTableBody";
    document.getElementById("resultsTable").replaceChild(newBody,oldBody);
}

function SearchNames(){
    let substring = document.getElementById("searchInp").value.toLowerCase();
    let tableBody = document.getElementById("resultsTableBody");
    let rows = tableBody.getElementsByTagName("tr");
    for(i = 0; i<rows.length; ++i){
        let td = rows[i].getElementsByTagName("td")[1];
        if(td){

            if(td.textContent.toLowerCase().indexOf(substring) > -1){ //show this row
                rows[i].style.display = "";
            }else{
                rows[i].style.display = "none";
            }
        }
    }
}

window.onload = function(e){
    document.getElementById("searchInp").addEventListener('change',SearchNames);
    document.getElementById("deleteBtn").addEventListener('click',function(){
        if(confirm("Delete all results?")){
            sendObjectFromPopup({action: "reset"});
            DeleteAllResults();
        }
    });
    document.getElementById("checkAll").addEventListener('change',function(){
        var chks = document.getElementsByClassName("resultsCheckBox");
        Array.prototype.forEach.call(chks,function(chk){chk.checked = document.getElementById("checkAll").checked;});
    });
    document.getElementById('infoBtn').addEventListener('click',function(){
        document.getElementById('infoPage').style.display = "";
        document.getElementById('jsonViewer').style.display = "none";
    });

    let data = {};
    JsonViewer.init(document.getElementById('jsonViewer'));

    const record = document.getElementById('recordBtn');
    const stop = document.getElementById('stopBtn');
    record.style.cursor = "auto";
    record.disabled = false;
    stop.style.cursor = "not-allowed";
    stop.disabled = true;
    

    record.addEventListener("click", function() {
        record.style.cursor = "not-allowed";
        record.disabled = true;
        stop.style.cursor = "auto";
        stop.disabled = false;
        sendObjectFromDevTools({action: "start"});
    });

    stop.addEventListener("click", function() {

        if (!confirm("Stop recording?")) {
            return;
        }
        stop.style.cursor = "not-allowed";
        stop.disabled = true;
        record.style.cursor = "auto";
        record.disabled = false;
        sendObjectFromDevTools({action: "stop"});
    });

    chrome.extension.onMessage.addListener(function (message, sender) {
        console.log(message, sender)
    
        if (message && message.action) return;
    
        data = message.data;
    
        if (data && data.functions && data.functions.length > 0) {
            DeleteAllResults();
            data.functions.forEach(func =>{
                let newRow = document.createElement("tr");
            
                let chkCol = document.createElement("td");;
                let chk = document.createElement("input");
                chk.type = "checkbox";
                chk.classList.add("resultsCheckBox");
                chkCol.appendChild(chk);
                newRow.appendChild(chkCol);
            
                let name = document.createElement("td");
                name.append(document.createTextNode(func.functionName));
                newRow.appendChild(name);
            
                let depth = document.createElement("td");
                depth.append(document.createTextNode(func.depth));
                newRow.appendChild(depth);
            
                newRow.addEventListener('click',function(){
                    let funcObj = func;
                    document.getElementById('infoPage').style.display = "none";
                    document.getElementById('jsonViewer').style.display = "";
                    JsonViewer.render(JSON.stringify(funcObj));
                })
            
                document.getElementById("resultsTableBody").appendChild(newRow);
            });   
        }
    });
    sendObjectFromDevTools({action: 'getData'});
};
