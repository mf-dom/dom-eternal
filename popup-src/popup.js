document.addEventListener("DOMContentLoaded", function () {
    const record = document.getElementById('recordbtn');
    const stop = document.getElementById('stopbtn');
    const settings = document.getElementById('settings');
    
    record.addEventListener("click", function() {

    });
    
    stop.addEventListener("click", function() {
        window.location.href = "results.html";
    });

    settings.addEventListener("click", function() {
        window.location.href = "settings.html";
    });
});