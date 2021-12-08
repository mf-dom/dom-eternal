

function AddRandomFunction(){
    let funcName = (Math.random() + 1).toString(36).substring(7);
    let funcSign = funcName+"(params)";
    AddFunctionToResults(funcName,funcSign,Math.random()>.5?"YES":"NO");
}

function AddFunctionToResults(functionName,functionSignature,isMutatingFunction){
    let newRow = document.createElement("tr");

    let chkCol = document.createElement("td");;
    let chk = document.createElement("input");
    chk.type = "checkbox";
    chk.classList.add("resultsCheckBox");
    chkCol.appendChild(chk);
    newRow.appendChild(chkCol);

    let name = document.createElement("td");
    name.append(document.createTextNode(functionName));
    newRow.appendChild(name);

    let signature = document.createElement("td");
    signature.append(document.createTextNode(functionSignature));
    newRow.appendChild(signature)

    let isMutating = document.createElement("td");
    isMutating.append(document.createTextNode(isMutatingFunction));
    newRow.appendChild(isMutating);

    document.getElementById("resultsTableBody").appendChild(newRow);
}

function DeleteAllResults(){
    let oldBody = document.getElementById("resultsTableBody");
    let newBody = document.createElement("tbody");
    newBody.id = "resultsTableBody";
    document.getElementById("resultsTable").replaceChild(newBody,oldBody);
}

function SearchSignatures(){
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
    document.getElementById("searchInp").addEventListener('change',SearchSignatures);
    document.getElementById("deleteBtn").addEventListener('click',DeleteAllResults);
    document.getElementById("randomAddBtn").addEventListener('click',AddRandomFunction);
    document.getElementById("checkAll").addEventListener('change',function(){
        var chks = document.getElementsByClassName("resultsCheckBox");
        Array.prototype.forEach.call(chks,function(chk){chk.checked = document.getElementById("checkAll").checked;});
    });


    const record = document.getElementById('recordBtn');
    const stop = document.getElementById('stopBtn');
    

    record.addEventListener("click", function() {
        record.style.cursor = "not-allowed";
        record.disabled = "true";
        sendObjectFromDevTools({action: "start"});
    });

    stop.addEventListener("click", function() {
        if (!confirm("Stop recording and see results?")) {
            return;
        }
        sendObjectFromDevTools({action: "stop"});
    });

    chrome.extension.onMessage.addListener(function(message, sender) {
        console.log(message);

        if (message && message.action) return;

    });
};


chrome.extension.onMessage.addListener(function (message, sender) {
    console.log(message, sender)

    if (message && message.action) return;

    data = message.data;

    if (data.functions && data.functions.length > 0) {
        data
    }

});