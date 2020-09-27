const {app, BrowserWindow, ipcMain, dialog, shell} = require('electron')
const logger = require('electron-log')
const fs = require('fs')
const dataDir = app.getPath('userData')
const dbFile = dataDir + '/config.json'
if(!fs.existsSync(dataDir + '/account.json')) fs.writeFileSync(dataDir + '/account.json',"{\"id\":\"undefined\",\"pass\":\"undefined\"}")
const accountData = JSON.parse(fs.readFileSync(dataDir + '/account.json'))
const { Client, Authenticator } = require('minecraft-launcher-core')

if(!fs.existsSync(dbFile)) fs.writeFileSync(dbFile,genJson("test","%AppData%/.minecraft","release","1.15.2","2G","2G"))
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
    if(isExists(version)){
        logger.info("launching")
        launch_with_json(getPathSafe(version))
    }
})

function getPathSafe(name,error,def){
    for (let key in dbData["versions"]){
        if(dbData["versions"][key]["name"]===name){
            return dbData["versions"][key]
        }
    }
    error()
    return def
}

function isExists(name){
    let b
    getPathSafe(name,() =>{
        b = false
    },"")
    if(b === undefined) b = true
    return b
}

ipcMain.on('add',(event,name,version,path)=>{
    dbData["versions"].add(version,path)
})


function genJson(name,gameDirectory,type,number,mem_max,mem_min){
    return `\"name\":\"${name}\",
    \"gameDirectory\":\"${gameDirectory}\",
    \"type\":\"${type}\",
    \"number\":\"${number}\",
    \"memory\":{
        \"max\":\"${mem_max}\",
        \"min\":\"${mem_min}\"
    }`
}

function launch_with_json(json){
    launch(getAccountSet(),json["type"],json["number"],json["gameDirectory"],json["memory"]["max"],json["memory"]["min"])
}

function launch(account,type,number,gameDirectory,mem_max,mem_min){
    let launcher = new Client()
    let options = {
        clientPackage:null,
        authorization:Authenticator.getAuth(account["id"],account["password"]),
        version:{
            number:number,
            type:type
        },
        memory:{
            max:mem_max,
            min:mem_min
        },
        overrides:{
            gameDirectory:gameDirectory.replace('%AppData%',process.env.APPDATA)
        }
    }
    launcher.launch(options).then(()=>{logger.info('launched!')})
}

function getAccountSet(){
    return {password : accountData["password"],id:accountData["id"]}
}

function isAccountExist(){
    let b = false
    if(getAccountSet()["password"] !== undefined && getAccountSet()["id"] !== undefined) b = true
    return b
}