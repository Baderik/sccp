function changeHost(oldUrl, newHost) {
    newHost = "//" + newHost + "/";
    return oldUrl.replace(new RegExp("/.*/"), newHost);
}
function getActiveUrls() {
    let result = [];
    let checkBoxes = document.getElementsByClassName("courtInput");
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            result.push(checkBoxes[i].getAttribute("data-url"))
        }
    }
    return result;
}
function openOthers(nowUrl) {
    let others = getActiveUrls();
    for (let i = 0; i < others.length; i++) {
        let newUrl = changeHost(nowUrl, others[i]);
        if (newUrl === nowUrl) continue;
        window.open(newUrl, "_blank");
        let count = localStorage.getItem("count");
        if (count === null) {
            count = 0;
        }
        localStorage.setItem("count", count + 1);
    }
}
function checkUrl(url) {
    let r = new RegExp("https?://.*.sudrf.ru/modules.php");
    return r.test(url)
}
function clickListTitle(e){
    let id = e.currentTarget.getAttribute("data-openId");
    let spanText = e.currentTarget;
    let firstSymbol = spanText.querySelector(".pre");
    let block = document.getElementById(id);

    if (firstSymbol.innerText === "➕"){
        firstSymbol.innerText = "➖";
        block.style.display = "block";
    }
    else if (firstSymbol.innerText === "➖"){
        firstSymbol.innerText = "➕";
        block.style.display = "none";
    }

}
function checkCheckboxes() {
    let checkBoxes = document.getElementsByClassName("courtInput");
    if (checkBoxes != null) {
        for (let i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].checked === false) return false;
        }
    }
    return true;
}
function updateCheckboxAll() {
    let checkBox = document.getElementById("all");
    checkBox.checked = checkCheckboxes();;
    localStorage.setItem(checkBox.getAttribute("data-url"), checkBox.checked);
}
function changeCheckboxAll(e) {
    let checkBoxes = document.getElementsByClassName("courtInput");
    for (let i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].checked = e.currentTarget.checked;
        localStorage.setItem(checkBoxes[i].getAttribute("data-url"), e.currentTarget.checked);
    }
    changeCheckbox(e);
}
function changeCheckbox(e) {
    localStorage.setItem(e.currentTarget.getAttribute("data-url"), e.currentTarget.checked);
    updateCheckboxAll();
}
function setCallbacks() {
    let listTitles = document.getElementsByClassName("listTitle");
    if (listTitles != null) {
        for (let i = 0; i < listTitles.length; i++) {
            listTitles[i].onclick = clickListTitle;
        }
    }
    let mainButton = document.getElementById("main");
    if (mainButton != null) {
        mainButton.onclick = function (event) {
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
                if (!checkUrl(tabs[0].url)) return;
                openOthers(tabs[0].url);
            });
        }
    }
    let checkBoxes = document.getElementsByClassName("courtInput");
    if (checkBoxes != null) {
        for (let i = 0; i < checkBoxes.length; i++) {
            checkBoxes[i].onchange = changeCheckbox;
        }
    }
    let checkboxAll = document.getElementById("all");
    if (checkboxAll != null) {
        checkboxAll.onchange = changeCheckboxAll;
    }
    let a = document.querySelectorAll("a");
    if (a != null) {
        for (let i = 0; i < a.length; i++) {
            a[i].onclick = function () {window.open(a[i].href, "_blank");}
        }
    }
}
function preparePopup() {
    let checkBoxes = document.getElementsByClassName("courtInput");
    if (checkBoxes != null) {
        for (let i = 0; i < checkBoxes.length; i++) {
            let value = localStorage.getItem(checkBoxes[i].getAttribute("data-url"));
            if (value != null) {
                value = value === "true";
                checkBoxes[i].checked = value;
            }
        }
    }
    let checkboxAll = document.getElementById("all");
    if (checkboxAll != null) {
        let value = localStorage.getItem(checkboxAll.getAttribute("data-url"));
        if (value != null) {
            value = value === "true";
            checkboxAll.checked = value;
        }
    }
}

preparePopup();
setCallbacks();