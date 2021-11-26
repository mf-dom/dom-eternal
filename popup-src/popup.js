document.addEventListener("DOMContentLoaded", function () {
    const record = document.getElementById('recordbtn');
    const stop = document.getElementById('stopbtn');
    const settings = document.getElementById('settings');
    
    record.addEventListener("click", function() {
        document.getElementById("recordbtn").style.cursor = "not-allowed";
        document.getElementById("recordbtn").disabled = "true";
    });
    
    stop.addEventListener("click", function() {
        window.location.href = "results.html";
        document.getElementById("recordbtn").disabled = "false";
        document.getElementById("recordbtn").style.cursor = "unset";
    });

    settings.addEventListener("click", function() {
        chrome.runtime.openOptionsPage();
    });
});