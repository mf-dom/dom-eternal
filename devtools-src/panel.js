

function AddRandomFunction(){
    let funcName = (Math.random() + 1).toString(36).substring(7);
    let funcSign = funcName+"(params)";
    AddFunctionToResults(funcName,funcSign,Math.random()>.5?"YES":"NO");
}

function AddFunctionToResults(functionName,functionSignature,isMutatingFunction){
    let newRow = document.createElement("tr");

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
};
