const express = require("express");
const controller = require("./controller");
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
    res.send("Server Running");
})

app.get("/data", (req, res) => {
    controller.getCache(process.env.CACHE_PATH).then(data => {
        res.json(data);
    })
})

app.put("/data", (req, res) => {
    controller.saveFileContents(process.env.CACHE_PATH, req.body).then(() => {
        res.status(200).send(req.body);
    })
})

app.post("/data/json/arranged", (req, res) => {
    controller.getCache(process.env.CACHE_PATH).then(cache => {
        let newData = controller.appendData(cache, req.body);
        let writeData = controller.getWriteData(req.body, rearrangedData);
        controller.saveFileContents(process.env.CACHE_PATH, writeData).then(() => {
            res.status(200).send(writeData);
        })
    })
})

app.post("/data/json/unarranged", (req, res) => {
    let rearrangedData = controller.rearrangeData(parsedData);
    controller.getCache(process.env.CACHE_PATH).then(cache => {
        let writeData = controller.getWriteData(cache, rearrangedData);
        controller.saveFileContents(process.env.CACHE_PATH, writeData).then(() => {
            res.status(200).send(writeData);
        })
    })
})

app.post("/data/string", (req, res) => {
    let parsedData = controller.parseData(req.body.string);
    let rearrangedData = controller.rearrangeData(parsedData);
    controller.getCache(process.env.CACHE_PATH).then(cache => {
        let writeData = controller.getWriteData(cache, rearrangedData);
        controller.saveFileContents(process.env.CACHE_PATH, writeData).then(() => {
            res.status(200).send(writeData);
        })
    })
})

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});