document.addEventListener("DOMContentLoaded", function () {
    const filter = document.getElementById("filter-button");
    const settings = document.getElementById("settings-button");
    const fuzz = document.getElementById("fuzz-button");
    const search_input = document.getElementById("search-input");
    const select_all = document.getElementById("select-all");
    const results_ul = document.getElementById("results_ul");
    let data = {};

    search_input.addEventListener("keyup", function () {
        var input, filter, ul, li, label, i, txtValue;
        filter = search_input.value.toUpperCase();
        ul = document.getElementById("results-ul");
        li = ul.getElementsByTagName('li');

        for (i = 0; i < li.length; i++) {
            label = li[i].getElementsByTagName("label")[0];
            txtValue = label.textContent || label.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    });

    select_all.addEventListener("click", function () {
        checkboxes = document.getElementsByName("result_cb");
        for (var i = 0, n = checkboxes.length; i < n; i++) {
            checkboxes[i].checked = select_all.checked;
        }
    });

    filter.addEventListener("click", function () {

    });

    fuzz.addEventListener("click", function () {
        window.location.href = "report.html";
    });

    settings.addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
    });

    chrome.extension.onMessage.addListener(function(message, sender) {
        console.log(message, sender)
        data = message.data;

    });
    sendObjectFromPopup({action: 'getData'})

});
