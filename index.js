const {app, BrowserWindow, ipcMain, dialog, shell} = require('electron')
const logger = require('electron-log')
const fs = require('fs')
const dataDir = app.getPath('userData')
const dbFile = dataDir + '/config.json'
const { Client, Authenticator } = require('minecraft-launcher-core')

if(!fs.existsSync(dbFile)) fs.writeFileSync(dbFile,genJson("test","release","1.15.2","2G","2G"))
const dbData = JSON.parse(fs.readFileSync(dbFile))

let window

const createWindow = () => {
    window = new BrowserWindow({
        width: 800,
        height:600,
        webPreferences: {
            nodeIntegration: false,
            preload: __dirname + '/js/preload.js',
        }
    })

    window.setMenu(null)
    window.webContents.openDevTools()
    window.loadFile(__dirname + '/views/index.html')
}

app.whenReady().then(createWindow)

ipcMain.on('launch',(event,version)=>{
    logger.info("on Launch Version:"+version)
    logger.info("dbFile:"+dbFile)
    logger.info("dbData:"+getPathSafe(version,()=>{
        logger.info(""+version+" is Not found!")
    },"Not Found!"))
})

function getPathSafe(version,error,def){
    for (let key in dbData["versions"]){
        if(key===version){
            return dbData["versions"][version]
        }
    }
    error()
    return def
}

ipcMain.on('add',(event,name,version,path)=>{
    dbData["versions"].add(version,path)
})


function genJson(name,type,number,mem_max,mem_min){
    return `\"name\":\"${name}\",
    \"type\":\"${type}\",
    \"number\":\"${number}\",
    \"memory\":{
        \"max\":\"${mem_max}\",
        \"min\":\"${mem_min}\"
    }`
}