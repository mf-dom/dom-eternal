document.addEventListener("DOMContentLoaded", function () {
    const filter = document.getElementById("filter-button");
    const settings = document.getElementById("settings-button");
    const fuzz = document.getElementById("fuzz-button");
    const search_input = document.getElementById("search-input");
    const select_all = document.getElementById("select-all");

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
        var list, i, switching, b, shouldSwitch, dir, switchcount = 0;
        list = document.getElementById("results-ul");
        switching = true;
        dir = "asc";
        while (switching) {
            switching = false;
            b = list.getElementsByTagName("li");
            for (i = 0; i < (b.length - 1); i++) {
                shouldSwitch = false;
                if (dir == "asc") {
                    if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (b[i].innerHTML.toLowerCase() < b[i + 1].innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                b[i].parentNode.insertBefore(b[i + 1], b[i]);
                switching = true;
                switchcount++;
            } else {
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    });

    fuzz.addEventListener("click", function () {
        window.location.href = "report.html";
    });

    settings.addEventListener("click", function () {
        chrome.runtime.openOptionsPage();
    });

    chrome.extension.onMessage.addListener(function (message, sender) {
        console.log(message, sender)
        const { data } = message;
        if (data.functions && data.functions.length > 0) {
            while (document.getElementById("results-ul").firstChild) {
                document.getElementById("results-ul").removeChild(document.getElementById("results-ul").firstChild);
            }

            data.functions.sort((a,b) => a.depth - b.depth).forEach(fun => {
                let li = document.createElement("li");
                let label = document.createElement("label");
                let input = document.createElement("input");
                input.type = "checkbox";
                input.name = "result_cb";
                label.appendChild(input);
                label.append(fun.functionName + " - Depth: " + fun.depth);
                label.title = "File: " + fun.url.split("/").slice(-1)[0];
                li.appendChild(label);
                document.getElementById("results-ul").appendChild(li);
            });
        } else {
            document.getElementById("results-list").style.display = "none";
            document.getElementById("no-results").style.display = "block";
        }

    });
    sendObjectFromPopup({ action: 'getData' })

});
