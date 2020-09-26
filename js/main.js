const electron = window.electron
const logger = window.log
const ipcRenderer = electron.ipcRenderer
// const dialog = electron.remote.dialog
//docs
const cards = document.getElementById("cards")
const launch = (element) =>{
    ipcRenderer.send('launch',element.getAttribute('version'))
}
const addCard = (name, ver) => {
    cards.innerHTML +=
        `
<div class="uk-card uk-card-hover uk-card-body">
    <img class="uk-border-rounded" src="../minecraft.png" width="40" height="40"/>
    <p class="uk-card-title uk-margin-remove">${name}</p>
    <div class="uk-card-body">
        <p>Version:${ver}</p>
    </div>
    <div class="uk-card-footer">
        <button class="uk-button uk-button-text" version="${ver}" onclick="launch(this)">
            Launch
        </button>
    </div>
</div>`
}

//ipcRenderer.send('launch', '1.15.2')

addCard("Test", 'test')