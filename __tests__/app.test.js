const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

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
        expect(response.body.topic.length).toBeGreaterThan(0);
        expect(typeof response.body.topic[0]).toBe("object");
      });
  });
});

describe("GET /api/incorrect-path", () => {
  test("responds with 404 status code when path is incorrect", () => {
    return request(app)
      .get("/api/wrong-path")
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });
});
