import{ contextBridge, ipcRenderer } from "electron";


const authenticateFunction = {
    authUser: (credentials) => ipcRenderer.send("authenticateUser", credentials),
    responseAuth: (message) => ipcRenderer.send("responseAuth", message),
}

const serverFunction = {
    startServer: (portNumber) => ipcRenderer.send("initateServer", portNumber),
    serverResponse: (event)=> ipcRenderer.on("serverResponse", event),
    stopServer: () => ipcRenderer.send('stopServer'),
    stopServerResponse: (event) => ipcRenderer.on("stopServerResponse", event)
}

contextBridge.exposeInMainWorld("authenticateApi", authenticateFunction)
contextBridge.exposeInMainWorld("serverApi", serverFunction)