require("dotenv").config();

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
const path = require('path');


mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log("DB CONNECTION ERR", err));


app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.get("/", (req,res) => {
    res.json({message: "Scheduler Service."});
});

const routesPath = path.resolve(__dirname, './routes')

readdirSync(routesPath).map((r) => app.use("/api", require("./routes/" + r)));


const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
