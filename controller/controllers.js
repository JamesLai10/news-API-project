const {
  getTopics,
  fetchArticleById,
  fetchAllArticles,
  insertComment,
  fetchCommentsByArticleId,
  updateArticleVotes,
  deleteComment,
  fetchAllUsers,
} = require("../model/models");
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

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  deleteComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
