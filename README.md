# news-API-project

**Project Link**: (https://backend-news-api-project.onrender.com/)

## Project summary

This project is a backend API for a news website, providing various endpoints to interact with articles, comments, users, and topics. It allows users to retrieve, create, and manipulate data related to news articles and comments.

## Getting started

To run this project locally, follow these steps:

### Requirements

- Node.js (v20.5.1 or higher)
- Postgres (v14.9 or higher)

### Installation

1. Clone the repository to your local machine:
   cd your-project
   git clone https://github.com/JamesLai10/news-API-project.git

2. Install dependencies:
   npm install express
   npm install supertest
   npm install pg-format

3. Create two '.env.' files in the project root:
   `.env.development` for development
   `.env.test` for testing

   in `.env.development` insert:
   PGDATABASE=development_database_name

   in `.env.test` insert:
   PGDATABASE=test_database_name

4. Create and seed the local database:
   npm run setup-dbs
   npm run seed

5. Run tests using:
   npm test
