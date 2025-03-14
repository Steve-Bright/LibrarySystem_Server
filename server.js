import express from "express"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import bodyParser from "body-parser"

import testRoute from "./routes/test.route.js";
import rootRoute from "./routes/root.route.js";
import userRoute from "./routes/user.route.js";
import cookieRoute from "./routes/cookie.route.js"
import bookRoute from "./routes/book.route.js"
import memberRoute from "./routes/member.route.js"
import loanRoute from "./routes/loan.route.js"
import connectToMongoDB  from "./config/connectMongoDb.js"
import {kayinGyiDirectory, kayinGyiBooks, kayinGyiMembers, kayinGyiTemp, kayinGyiBooksBarcode, kayinGyiMembersBarcode, kayinGyiCSVFile} from "./utils/directories.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


if(!fs.existsSync(kayinGyiDirectory)){
    fs.mkdirSync(kayinGyiDirectory)
    console.log("Kayin Gyi directory is created")
}
if(!fs.existsSync(kayinGyiBooks)){
    fs.mkdirSync(kayinGyiBooks)
    
}
if(!fs.existsSync(kayinGyiMembers)){
    fs.mkdirSync(kayinGyiMembers)
}

if(!fs.existsSync(kayinGyiTemp)){
    fs.mkdirSync(kayinGyiTemp)
}

if(!fs.existsSync(kayinGyiBooksBarcode)){
    fs.mkdirSync(kayinGyiBooksBarcode)
}

if(!fs.existsSync(kayinGyiMembersBarcode)){
    fs.mkdirSync(kayinGyiMembersBarcode)
}

if(!fs.existsSync(kayinGyiCSVFile)){
    fs.mkdirSync(kayinGyiCSVFile)
}


const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: "50mb"}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
});

// app.use("/", (req, res, next) => {
//     res.send("Server is running")
//     next()
// })
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "server.html"))
})
app.use("/api/test", testRoute )
app.use("/rootAccess", rootRoute)
app.use("/accounts/authentication", userRoute)
app.use("/cookie", cookieRoute)
app.use("/book", bookRoute)
app.use("/member", memberRoute)
app.use("/loan", loanRoute)

app.use("*", (req, res) => {
    res.status(404).json({ con: false, msg: "Invalid route" });
});

app.use((err, req, res, next) => {
    err.status = err.status || 505;
    res.status(err.status).json({ con: false, msg: err.message });
  });

// app.listen(3000, () => {
//     connectToMongoDB();
//     console.log('Server is running on port 3000');
// });
export default app;