document.addEventListener("DOMContentLoaded", function() {
    const home = document.getElementById("home-btn");

    home.addEventListener("click", function() {
        window.location.href = "popup.html";
    });
});