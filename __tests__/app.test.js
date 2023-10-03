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
