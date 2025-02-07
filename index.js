import {app, BrowserWindow, ipcMain, dialog} from "electron"
import {encode} from "./utils/libby.js"
import User from "./model/user.model.js";
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
        win.loadFile("home.html")
    }else{
        dialog.showMessageBoxSync(win, {
            message: "Wrong credentials"
        })
    }
})



ipcMain.on("navigate-to-page", (event, page) => {
    const currentWindow = win || BrowserWindow.getFocusedWindow();
    currentWindow.loadFile(path.join(__dirname, page));
  });

let server;
ipcMain.on("serverStatus", (event) => {
    if(server){
        console.log("there is server " + JSON.stringify(server))
        event.sender.send("serverStatusResponse", server["_connectionKey"])
    }else{
        event.sender.send("serverStatusResponse", false)
    }
})

ipcMain.on("initateServer", (event, portNumber=3000) => {
    try{
        server = nodeServer.listen(portNumber, () => {
            connectToMongoDB();
        })

        server.on("error", (err) => {
            console.log("error" + err.message)
            event.sender.send("serverResponse", err.message)
        });
    }catch(error){

        event.sender.send("serverResponse", false);
    }

})

ipcMain.on("createAccount", async(event, credentials) => {
    try{
        if(!server){
            dialog.showMessageBoxSync(win, {
                message: "Server is not running"
            })
            return;
        }
        credentials.password = encode(credentials.password)
        let user = new User(credentials);
        await user.save();
        dialog.showMessageBoxSync(win, {
            message: "Account created successfully"
        })
        win.loadFile("createAccount.html")
    }catch(error){
        console.log("error" + error)
    }
})

ipcMain.on("getAccounts", async(event) => {
    try{
        console.log("this is here")
        let users = await User.find({}, {password: 0});
        event.sender.send("getAccountsResponse", JSON.stringify(users))
    }catch(error){
        console.log("error" + error)
    }
})

ipcMain.on("stopServer", (event) => {
    try{
        if(server){
            server.close(() => {

            })
            server = null;
        }else{
            event.sender.send("stopServerResponse", false)
        }
       
    }catch(error){

        event.sender.send("stopServerResponse", false)
    }
})

export default win;