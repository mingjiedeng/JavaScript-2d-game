const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("docs"));

const server = app.listen(port, () =>
  console.log("Server started at port " + port)
);
