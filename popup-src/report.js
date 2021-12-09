document.addEventListener("DOMContentLoaded", function() {
    const home = document.getElementById("home-btn");

    let data = {};

    home.addEventListener("click", function() {
        sendObjectFromPopup({action: "resetAnalysis"});
        window.location.href = "popup.html";
    });

    chrome.extension.onMessage.addListener(function(message, sender) {
        console.log(message);

        if (message && message.action) return;

        if (message.data && message.data.functions) {
            document.getElementById('numFunctions').innerText = message.data.functions.filter(a => a.selected).length;
            document.getElementById('numVulns').innerText = message.data.functions.filter(a => a.vulnerable).length;
        }
    });

    sendObjectFromPopup({ action: 'getData' })
});
