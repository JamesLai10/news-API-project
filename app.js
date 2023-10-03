const express = require("express");
const app = express();
const { getAllTopics, getEndpoints } = require("./controller/controllers");
// const endpointsData = require("./endpoints.json");

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
});

module.exports = app;
