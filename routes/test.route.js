import express from "express";

const router = express.Router();   

router.get("/getApi", (req, res) => {
    res.send("get api test")
})

router.post("/postApi", (req, res) => {
    res.send("post api test")
})
router.put("/putApi", (req, res) => {
    res.send("put api test")
})
router.delete("/deleteApi", (req, res) => {
    res.send("delete api test")
})

export default router;