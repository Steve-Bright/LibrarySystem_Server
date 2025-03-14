import{ contextBridge, ipcRenderer } from "electron";

const navigationFunction = {
    toAnotherPage: (page) => ipcRenderer.send("navigate-to-page", page),
}

const authenticateFunction = {
    authUser: (credentials) => ipcRenderer.send("authenticateUser", credentials),
    responseAuth: (message) => ipcRenderer.send("responseAuth", message),
    createAccount: (credentials) => ipcRenderer.send("createAccount", credentials),
    getAccounts: () => ipcRenderer.send("getAccounts") ,
    getAccountsResponse: (event) => ipcRenderer.on("getAccountsResponse", event)

}

const serverFunction = {
    startServer: (portNumber) => ipcRenderer.send("initateServer", portNumber),
    // serverResponse: (event)=> ipcRenderer.on("serverResponse", event),
    stopServer: () => ipcRenderer.send('stopServer'),
    // stopServerResponse: (event) => ipcRenderer.on("stopServerResponse", event),
    serverStatus: (event)=> ipcRenderer.send("serverStatus"),
    serverStatusResponse: (event) => ipcRenderer.on("serverStatusResponse", event)
}

const cookieFunction = {
    checkCookie: ()=> ipcRenderer.sendSync("checkCookies")
}

contextBridge.exposeInMainWorld("navigationApi", navigationFunction)
contextBridge.exposeInMainWorld("authenticateApi", authenticateFunction)
contextBridge.exposeInMainWorld("serverApi", serverFunction)
contextBridge.exposeInMainWorld("cookieApi", cookieFunction)