const express = require("express");

require("dotenv").config();

const router = require("./router");

const app = express();

app.use(express.json());
app.use(router);

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});
