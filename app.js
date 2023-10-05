const express = require("express");
const app = express();
const {
  getAllTopics,
  getEndpoints,
  getArticleById,
  getAllArticles,
  postCommentByArticleId,
  getCommentsByArticleId,
  patchArticleVotes,
} = require("./controller/controllers");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors");

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
