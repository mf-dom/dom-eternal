document.addEventListener("DOMContentLoaded", function () {
    const record = document.getElementById('recordbtn');
    const stop = document.getElementById('stopbtn');
    const settings = document.getElementById('settings');
    const info = document.getElementById("info");

    record.addEventListener("click", function() {
        document.getElementById("recordbtn").style.cursor = "not-allowed";
        document.getElementById("recordbtn").disabled = "true";
        sendObjectFromPopup({action: "start"});
    });

    stop.addEventListener("click", function() {
        if (!confirm("Stop recording and see results?")) {
            return;
        }
        window.location.href = "results.html";
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
