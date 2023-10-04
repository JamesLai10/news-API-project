const express = require("express");
const app = express();
const {
  getAllTopics,
  getEndpoints,
  getArticleById,
  getAllArticles,
} = require("./controller/controllers");

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get(
  "/api/articles",
  (req, res, next) => {
    console.log(req.query);
    const { invalid_query } = req.query;

    if (invalid_query === "true") {
      const error = new Error("Invalid input");
      error.status = 400;
      next(error);
    } else {
      next();
    }
  },
  getAllArticles
);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ error: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ error: "Invalid input" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Server Error!");
});

module.exports = app;
