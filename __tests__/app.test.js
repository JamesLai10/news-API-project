const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const expectedEndpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return connection.end();
});

describe("GET /api/topics", () => {
  test("returns 200 status code and an array of objects", () => {
    return request(app)
      .get("/api/topics")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.topic)).toBe(true);
        expect(response.body.topic.length).toBe(3);
        const expectedProperties = ["slug", "description"];
        response.body.topic.forEach((element) => {
          expectedProperties.forEach((property) => {
            expect(element).toHaveProperty(property);
            expect(typeof element[property]).toBe("string");
          });
        });
      });
  });
});

describe("GET /api/incorrect-path", () => {
  test("responds with 404 status code when path is incorrect", () => {
    return request(app)
      .get("/api/wrong-path")
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.error.message).toBe("cannot GET /api/wrong-path (404)");
      });
  });
});

describe("GET /api", () => {
  test("returns 200 status code and endpoint documentation", () => {
    return request(app)
      .get("/api")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedEndpoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("returns 200 status code and the specified article by ID", () => {
    return request(app)
      .get("/api/articles/1")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("article");
        const article = response.body.article;
        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("returns 404 status code when the article ID does not exist", () => {
    return request(app)
      .get("/api/articles/999")
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("No article found for article_id 999");
      });
  });
  test("returns 400 status code when the article ID is of the wrong data type", () => {
    return request(app)
      .get("/api/articles/notNumber")
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid input");
      });
  });
  test("returns 404 status code when the path is misspelled", () => {
    return request(app)
      .get("/api/articlessss/1")
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.error.message).toBe(
          "cannot GET /api/articlessss/1 (404)"
        );
      });
  });
});

describe("GET /api/articles", () => {
  test("returns 200 status code and an array of articles with adjusted properties", () => {
    return request(app)
      .get("/api/articles")
      .then((response) => {
        const articles = response.body.articles;
        expect(response.status).toBe(200);
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
          expect(article).toHaveProperty("comment_count");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
      });
  });
  test("returns an array of articles in descending order by date", () => {
    return request(app)
      .get("/api/articles")
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("returns 201 status code and the posted comment", () => {
    const newComment = {
      username: "icellusedkars",
      body: "A new comment!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .then((response) => {
        const comment = response.body.comment;
        expect(response.status).toBe(201);
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("author", newComment.username);
        expect(comment).toHaveProperty("article_id", 1);
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("body", newComment.body);
      });
  });
  test("returns 404 status code when the article_id does not exist", () => {
    const newComment = {
      username: "icellusedkars",
      body: "A new comment!",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("No article found for article_id 999");
      });
  });
  test("returns 400 status code when 'username' or 'body' is missing", () => {
    const invalidComment = {
      body: "Bad comment!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(invalidComment)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
          "Both 'username' and 'body' are required for a comment."
        );
      });
  });
  test("returns 404 status code when user does not exist", () => {
    const newComment = {
      username: "unknownUser",
      body: "A new comment!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Username 'unknownUser' not found.");
      });
  });
  test("should ignore properties that are not relevant on comment body", () => {
    const newComment = {
      username: "icellusedkars",
      body: "A new comment!",
      irrelevantProperty: "This should be ignored",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("author", newComment.username);
        expect(comment).toHaveProperty("article_id", 1);
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("body", newComment.body);

        expect(comment).not.toHaveProperty("irrelevantProperty");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("returns 200 status code and an array of comments for a valid article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then((response) => {
        const comments = response.body.comments;
        expect(response.status).toBe(200);
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id", 1);
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");

          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  test("returns 404 status code when article_id does not exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("article_id '999' does not exist");
      });
  });
  test("returns 400 status code when article_id is of the wrong data type", () => {
    return request(app)
      .get("/api/articles/notNumber/comments")
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid input");
      });
  });
  test("returns 200 status code and an empty array for a valid article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.body.comments).toEqual([]);
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("returns 200 status code and updates the article's votes when increasing vote count", () => {
    const incVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(incVotes)
      .then((response) => {
        const updatedArticle = response.body.article;
        expect(response.status).toBe(200);
        expect(updatedArticle).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(updatedArticle).toHaveProperty("topic", "mitch");
        expect(updatedArticle).toHaveProperty("author", "butter_bridge");
        expect(updatedArticle).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(updatedArticle).toHaveProperty(
          "created_at",
          "2020-07-09T20:11:00.000Z"
        );
        expect(updatedArticle).toHaveProperty("votes", 101);
        expect(updatedArticle).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("returns updated article with article's votes when decreasing vote count", () => {
    const decreaseVote = { inc_votes: -2 };
    return request(app)
      .patch("/api/articles/1")
      .send(decreaseVote)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 1,
          votes: 98,
        });
      });
  });
  test("returns 404 status code when the article ID does not exist", () => {
    const incVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/999")
      .send(incVotes)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("No article found for article_id 999");
      });
  });
  test("returns 400 status code when inc_votes is not a number", () => {
    const invalidVote = { inc_votes: "not a number" };
    return request(app)
      .patch("/api/articles/1")
      .send(invalidVote)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid input, must be a number");
      });
  });
  test("returns 400 status code when ID is in the wrong data type", () => {
    const incVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/bananas")
      .send(incVotes)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid input");
      });
  });
});
