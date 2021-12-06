document.addEventListener("DOMContentLoaded", function () {
    const record = document.getElementById('recordbtn');
    const stop = document.getElementById('stopbtn');
    const settings = document.getElementById('settings');
    const info = document.getElementById("info");

    record.addEventListener("click", function() {
        recording = true;
        record.style.cursor = "not-allowed";
        record.disabled = true;
        document.getElementById('stopbtn').disabled = false;
        document.getElementById('recording').style.display = "flex";
        document.getElementById('status').style.display = "block";
        document.getElementById('infobtn').style.display = "none";
        document.getElementById('note').style.display = "none";
        sendObjectFromPopup({action: "start"});

        const status_messages = ['intializing...', 'sending message to devtools', 'starting instrumentation', 'recording...'];
        for (var i=0; i < status_messages.length; i++) {
            document.getElementById('status').innerHTML = status_messages[i];
            // not sure how to sleep without crashing the extension
        }
    });

    stop.addEventListener("click", function() {
        if (!confirm("Stop recording and see results?")) {
            return;
        }
        window.location.href = "results.html";
        document.getElementById('recording').style.display = "none";
        sendObjectFromPopup({action: "stop"});
    });

    settings.addEventListener("click", function() {
        chrome.runtime.openOptionsPage();
    });

    info.addEventListener("click", function() {
        window.location.href = "info.html";
    });

    chrome.extension.onMessage.addListener(function(message, sender) {
        console.log(message, sender)
    });

    sendObjectFromPopup({action: 'getData'})
});
