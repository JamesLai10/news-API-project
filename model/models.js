const db = require("../db/connection");

exports.getTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => result.rows);
};

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          message: `No article found for article_id ${article_id}`,
        });
      }
      return article;
    });
};

exports.fetchAllArticles = () => {
  return db
    .query(
      `
      SELECT
      articles.article_id,
      articles.author,
      articles.title,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.article_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;    
  `
    )
    .then((result) => result.rows);
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
      SELECT *
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;
    `,
      [article_id]
    )
    .then(({ rows }) => {
      const comments = rows;
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          message: `No comments found for article_id ${article_id}`,
        });
      }
      return comments;
    });
};
