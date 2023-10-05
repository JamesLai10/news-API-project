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

exports.insertComment = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({
      status: 400,
      message: "Both 'username' and 'body' are required for a comment.",
    });
  }

  return db
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: `Username '${username}' not found.`,
        });
      }

      return db
        .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
        .then((result) => {
          if (result.rows.length === 0) {
            return Promise.reject({
              status: 404,
              message: `No article found for article_id ${article_id}`,
            });
          }

          return db
            .query(
              `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
              [article_id, username, body]
            )
            .then(({ rows }) => {
              const comment = rows[0];
              return comment;
            });
        });
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          message: `article_id '${article_id}' does not exist`,
        });
      }
      return db.query(
        `
          SELECT *
          FROM comments
          WHERE article_id = $1
          ORDER BY created_at DESC;
        `,
        [article_id]
      );
    })
    .then(({ rows }) => {
      const comments = rows;
      return comments;
    });
};
