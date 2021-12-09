
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
    // const filter = document.getElementById('filterBtn');
    const fuzz = document.getElementById('fuzzBtn');

    search.addEventListener('change',SearchNames);
    document.getElementById("checkAll").addEventListener('change',function(){
        var chks = document.getElementsByClassName("resultsCheckBox");
        Array.prototype.forEach.call(chks,function(chk){chk.checked = document.getElementById("checkAll").checked;});
    });

    let data = {};
    let currentlyAnalyzing = false;

    JsonViewer.init(document.getElementById('jsonViewer'));

    record.style.cursor = "auto";
    record.disabled = false;
    stop.style.cursor = "not-allowed";
    stop.disabled = true;
    fuzz.style.cursor = "not-allowed";
    fuzz.disabled = true;

    function showRecordingState() {
        record.style.cursor = "not-allowed";
        record.innerText = "Recording";
        record.disabled = true;
        stop.style.cursor = "auto";
        stop.disabled = false;
        fuzz.style.cursor = "not-allowed";
        fuzz.disabled = true;
        document.getElementsByClassName('pulsating-circle')[0].style.display = "block";
    }

    function showStoppedState() {
        record.style.cursor = "auto";
        record.innerText = "Record";
        record.disabled = false;
        stop.style.cursor = "not-allowed";
        stop.disabled = true;
        document.getElementsByClassName('pulsating-circle')[0].style.display = "none";

        if (data && data.functions && data.functions.length > 0) {
            fuzz.style.cursor = "auto";
            fuzz.disabled = false;
        }
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
        document.getElementById('infoPage').style.display = "block";
        document.getElementById('jsonViewer').style.display = "none";
        sendObjectFromDevTools({action: "getData"});
    });

    fuzz.addEventListener("click", function () {
        currentlyAnalyzing = true;
        if (data.functions && data.functions.length > 0) {
            const checkedState = [...document.getElementsByClassName("resultsCheckBox")].map(node => node.checked);
            if (checkedState.some(a => a)) {
                const functionsWithSelections = data.functions.map((func, index) => ({...func, selected: checkedState[index]}));
                sendObjectFromDevTools({"action": "startAnalysis", functionsWithSelections});
                document.getElementById('fuzzBtn').style.display = "none";
                fuzz.style.opacity = "50%";
                record.style.cursor = "not-allowed";
                record.disabled = true;
                document.getElementById('progress').style.display = "block";
                document.getElementById('progress-bar').style.animationDuration = `${checkedState.filter(a => a).length * 2.5}s`;
                setTimeout(() => {
                    document.getElementById('progress').style.display = "none";
                    document.getElementById('fuzzBtn').style.display = "block";
                    record.style.cursor = "auto";
                    record.disabled = false;
                    currentlyAnalyzing = false;
                    sendObjectFromDevTools({action: "getData"});
                }, checkedState.filter(a => a).length * 2500);
            } else {
                window.alert("Please select at least one function.");
            }
        } else {
            window.alert("The tool hasn't recorded any functions to fuzz yet - try resuming recording to gather more data.");
        }
    });

    download.addEventListener("click", function () {
        if (data && data.functions && data.functions.length > 0 || data.mutations && data.mutations.length > 0) {
            const exportData = {rawMutations: data.mutations, parsedFunctions: data.functions};
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, "\t"));
            const dummyA = document.createElement('a');
            dummyA.setAttribute("href", dataStr);
            dummyA.setAttribute("download", "DOM-Eternal_Export.json");
            dummyA.click();
        } else {
            alert("No data to export yet!");
        }
    });

    chrome.extension.onMessage.addListener(function (message, sender) {
        console.log(message, sender)

        if (message && message.action) return;

        data = message.data;

        if (data && data.functions) {
            if (currentlyAnalyzing === true) return;

            DeleteAllResults();

            data.functions.forEach(func => {
                let newRow = document.createElement("tr");

                if (func.vulnerable) {
                    newRow.classList.add("vulnerable");
                }

                let chkCol = document.createElement("td");
                let chk = document.createElement("input");
                chk.type = "checkbox";
                chk.classList.add("resultsCheckBox");
                chk.checked = func.selected || false;
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

        if (data && data.recording) {
            showRecordingState();
        }

        if (data && data.doneRecording) {
            showStoppedState();
        }

    });
    sendObjectFromDevTools({action: 'getData'});
};
