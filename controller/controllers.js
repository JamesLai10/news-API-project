const { getTopics } = require("../model/models");

exports.getAllTopics = (req, res, next) => {
  getTopics()
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch(next);
};
