const electron = require('electron')
const logger =require('electron-log')

process.once(
    'loaded',
    ()=>{
        global.process = process;
        global.electron = electron;
        global.logger = logger;
        global.module = module;
    }
)