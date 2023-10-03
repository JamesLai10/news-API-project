const express = require("express");
const app = express();
const {
  getAllTopics,
  getEndpoints,
  getArticleById,
} = require("./controller/controllers");

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ error: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ error: "Invalid input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
});

module.exports = app;
