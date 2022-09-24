const controller = require("./controller");
const router = require('express').Router();

router.get("/", (req, res) => {
    res.send("Tachiyomi Error Parser running");
})

router.get("/data", controller.getCacheData)

router.put("/data", controller.getCacheData)

router.post("/data/json/arranged", controller.addDataArrangedJSON)

router.post("/data/json/unarranged", controller.addDataUnArrangedJSON)

router.post("/data/string", controller.addDataString)

module.exports = router;
