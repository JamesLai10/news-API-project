const {
  getTopics,
  fetchArticleById,
  fetchAllArticles,
} = require("../model/models");
const endpointsData = require("../endpoints.json");
const articles = require("../db/data/test-data/articles");

exports.getAllTopics = (req, res, next) => {
  getTopics()
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
  res.json(endpointsData);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
