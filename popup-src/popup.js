document.addEventListener("DOMContentLoaded", function () {
    const record = document.getElementById('recordbtn');
    const stop = document.getElementById('stopbtn');
    const settings = document.getElementById('settings');
    const info = document.getElementById("info");

    function showRecordingState() {
        record.style.cursor = "not-allowed";
        record.disabled = true;
        document.getElementById('stopbtn').disabled = false;
        document.getElementById('recording').style.display = "flex";
        document.getElementById('status').style.display = "block";
        document.getElementById('infobtn').style.display = "none";
        document.getElementById('note').style.display = "none";
        document.getElementById('error').style.display = "none";
        [...document.getElementsByClassName('recording-dot')].forEach(dot => dot.style.background = "red");
    }

    record.addEventListener("click", function () {
        if (!confirm("Make sure Chrome Developer Tools (F12) is open. Start recording?")) {
            return;
        }
        sendObjectFromPopup({ action: "start" });

        showRecordingState();

        document.getElementById('status').innerText = 'intializing...';
        setTimeout(() => {
            document.getElementById('status').innerText = 'sending message to devtools';
        }, 500);
        setTimeout(() => {
            document.getElementById('status').innerText = 'starting instrumentation';
        }, 1000);
        setTimeout(() => {
            document.getElementById('status').innerText = 'recording...';
            [...document.getElementsByClassName('recording-dot')].forEach(dot => dot.style.background = "forestgreen");
        }, 2000);

    });

    stop.addEventListener("click", function () {
        if (!confirm("Stop recording and see results?")) {
            return;
        }
        window.location.href = "results.html";
        document.getElementById('recording').style.display = "none";
        sendObjectFromPopup({ action: "stop" });
    });

    settings.addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
    });

    info.addEventListener("click", function () {
        window.location.href = "info.html";
    });

    chrome.extension.onMessage.addListener(function(message, sender) {
        console.log(message);

        if (message && message.action) return;

        if (message.data && message.data.recording) {
            showRecordingState();
            document.getElementById('status').innerText = 'recording...';
            [...document.getElementsByClassName('recording-dot')].forEach(dot => dot.style.background = "forestgreen");
        }

        if (message.data && message.data.functions) {
            document.getElementById('numFunctions').innerText = message.data.functions.length;
        }

        if (message.data && message.data.doneRecording) {
            window.location.href = "results.html";
        }

        if (message.data && message.data.panelNotOpen) {
            document.getElementById('error').style.display = "block";
            document.getElementById('recording').style.display = "none";
        }

    });

    sendObjectFromPopup({ action: 'getData' })
});
