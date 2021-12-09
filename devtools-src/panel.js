function AddFunctionToResults(func){
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

    document.getElementById("resultsTableBody").appendChild(newRow);
}

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
    const record = document.getElementById('recordBtn');
    const stop = document.getElementById('stopBtn');
    const reset = document.getElementById('deleteBtn');
    const search = document.getElementById('searchInp');
    const download = document.getElementById('exportBtn');
    const filter = document.getElementById('filterBtn');

    search.addEventListener('change',SearchNames);
    document.getElementById("checkAll").addEventListener('change',function(){
        var chks = document.getElementsByClassName("resultsCheckBox");
        Array.prototype.forEach.call(chks,function(chk){chk.checked = document.getElementById("checkAll").checked;});
    });

    let data = {};

    record.style.cursor = "auto";
    record.disabled = false;
    stop.style.cursor = "not-allowed";
    stop.disabled = true;

    function showRecordingState() {
        record.style.cursor = "not-allowed";
        record.innerText = "Recording";
        record.disabled = true;
        stop.style.cursor = "auto";
        stop.disabled = false;
        document.getElementsByClassName('pulsating-circle')[0].style.display = "block";
    }

    function showStoppedState() {
        record.style.cursor = "auto";
        record.innerText = "Record";
        record.disabled = false;
        stop.style.cursor = "not-allowed";
        stop.disabled = true;
        document.getElementsByClassName('pulsating-circle')[0].style.display = "none";
    }

    record.addEventListener("click", function() {
        if (data && data.doneRecording) {
            sendObjectFromDevTools({action: "resume"});
        } else {
            sendObjectFromDevTools({action: "start"});
        }
        showRecordingState();
    });

    stop.addEventListener("click", function() {

        if (!confirm("Stop recording?")) {
            return;
        }
        showStoppedState();
        record.innerText = "Resume recording";
        sendObjectFromDevTools({action: "stop"});
    });

    reset.addEventListener("click", function() {
        sendObjectFromDevTools({action: "reset"});
        showStoppedState();
    });

    chrome.extension.onMessage.addListener(function (message, sender) {
        console.log(message, sender)

        if (message && message.action) return;

        data = message.data;

        if (data && data.functions && data.functions.length > 0) {
            DeleteAllResults();
            data.functions.forEach(func => AddFunctionToResults(func));
        }

        if (data && data.recording) {
            showRecordingState();
        }

        if (data && data.doneRecording) {
            showStoppedState();
        }

    });
    sendObjectFromDevTools({action: 'getData'});
};
