import {app, BrowserWindow, ipcMain, dialog} from "electron"
import connectToMongoDB  from "./config/connectMongoDb.js"
import nodeServer from "./server.js"
import path from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let win;
const createWindow = () => {
    win = new BrowserWindow({
      width: 500,
      height: 300,
      resizable: false, 
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.mjs")
      }
    })
    win.loadFile('auth.html')
    // win.removeMenu();
    // win.webContents.openDevTools();
}


app.whenReady().then(() => {createWindow() })
  
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("authenticateUser", (event, credentials) => {
    if(credentials.username === "admin" && credentials.password === "89916002"){
        console.log('correct!')
        win.loadFile("home.html")
    }else{
        console.log("incorrect!")
        dialog.showMessageBoxSync(win, {
            message: "Wrong credentials"
        })
    }
})
let server;
ipcMain.on("initateServer", (event, portNumber=3000) => {
    try{
        server = nodeServer.listen(portNumber, () => {
            connectToMongoDB();
        })

        server.on("error", (err) => {
            console.log("error" + err.message)
            event.sender.send("serverResponse", err.message)
        });
        event.sender.send("serverResponse", true)
    }catch(error){

        event.sender.send("serverResponse", false);
    }

})

ipcMain.on("stopServer", (event) => {
    try{
        if(server){
            server.close(() => {

            })
            event.sender.send("stopServerResponse", true)
        }else{
            event.sender.send("stopServerResponse", false)
        }
        

       
    }catch(error){

        event.sender.send("stopServerResponse", false)
    }
})

export default win;