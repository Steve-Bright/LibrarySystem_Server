import express from "express"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import connectToMongoDB  from "./config/connectMongoDb.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/test", testRoute )
app.use("/accounts/authentication", userRoute)

app.use("*", (req, res) => {
    res.status(404).json({ con: false, msg: "Invalid route" });
});

app.listen(3000, () => {
    connectToMongoDB();
    console.log('Server is running on port 3000');
});