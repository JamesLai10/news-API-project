const { getTopics, fetchArticleById } = require("../model/models");
const endpointsData = require("../endpoints.json");

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
