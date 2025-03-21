import {app, BrowserWindow, session, ipcMain, dialog} from "electron"
import {encode, decode} from "./utils/libby.js"
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
      title: "RCS Server",
      resizable: false, 
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.mjs")
      }
    })
    win.loadFile('auth.html')
    win.removeMenu();
    // win.webContents.openDevTools();
}


app.whenReady().then(() => {createWindow() })
  
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("authenticateUser", (event, credentials) => {
    if(credentials.username === "admin" && decode(credentials.password,"$2b$10$I4HzXhFb8ThSJCx8keSQOuDAtGWeMUkPsjeG.lTL7f1DYQZcoGw76")){
        const cookie = { url: "http://localhost", name: "server", httpOnly: true, secure: false};
        session.defaultSession.cookies
          .set(cookie)
          .then(() => {
            console.log("Cookie is successfully set");
          })
          .catch((error) => {
            console.error(error);
          });
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

        let accountCreation = true;
        if(credentials.role == "manager"){
            let countResult = await User.countDocuments({role: "manager"})
            if(countResult >= 1){
                accountCreation = false;
            }
        }else if(credentials.role == "helper"){
            let countResult = await User.countDocuments({role: "helper"})
            if(countResult >= 3){
                accountCreation = false;
            }
        }
        // let result = await User.countDocuments({role: "manager"})
        // console.log("counting the result " + result)
        credentials.password = encode(credentials.password)
        if(accountCreation){
            let duplicateError = false;
            let duplicateEmail = await User.findOne({email: credentials.email})
            if(duplicateEmail){
                duplicateError = true;
            }

            let duplicateUsername = await User.findOne({userName: credentials.userName})
            if(duplicateUsername){
                duplicateError = true;
            }

            if(!duplicateError){
                let user = new User(credentials);
                await user.save();
                dialog.showMessageBoxSync(win, {
                    message: "Account created successfully"
                })
            }else{
                dialog.showMessageBoxSync(win, {
                    message: "Account with such email or username exists"
                })
            }

        }else{
            dialog.showMessageBoxSync(win, {
                message: "Account cannot be created due to limitation; Manager 1 Helper 3"
            })
        }
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

ipcMain.on("deleteUser", async(event, data) => {
    try{
        const deletedUser = await User.findByIdAndDelete(data)
        if(!deletedUser){
            dialog.showMessageBoxSync(win, {
                message: "User Not found"
            })
        }
    }catch(error){
        console.log("delete user error " + error)
    }
    win.loadFile("memberAccounts.html")
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

ipcMain.on("checkCookies", (event, data) => {
    session.defaultSession.cookies
      .get({ url: "http://localhost", name: "server" })
      .then((cookies) => {
        if(cookies.length === 0){
            event.returnValue = { statusCode: 403}
        }else{
            event.returnValue = { statusCode: 200}
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });


export default win;