# Northcoders News API

# ---ABOUT ---

# A simple RESTful API mimicking the back end of a news app
# Built with Node.js (v.20.5.1) + PostgreSQL (v.14.9)
# Should work on all versions of Node v.0.10 or later - v.20 is recommended

# A hosted version to try out can be found here: https://nc-news-0dd5.onrender.com
# Code can be found at: https://github.com/yvevolk/nc-news
# For a list of endpoints, queries and example responses, see endpoint /api/ https://nc-news-0dd5.onrender.com/api

# --- RUNNING SCRIPTS LOCALLY ---

# 1. Ensure node.js and PostgreSQL are installed:
# Installation and docs can be found at:
# Node.js: https://nodejs.org/en
# PostgreSQL: https://www.postgresql.org/

# 2. Clone the GitHub repo https://github.com/yvevolk/nc-news.git to your own computer:
#   - Open terminal on your computer, navigate to your directory of choice
#   - Type 'git clone <URL>' into terminal, replacing <URL> with the URL above (no apostrophes)
#   - Run the command: this should create a local copy

# 3. Set up .env files:
#   - Open nc-news directory
#   - Create two files in directory: .env.development and .env.test - env.development uses development data, env.test uses basic test data
#   - In .env.development, type PGDATABASE=nc_news
#   - In .env.development, type PGDATABADE=nc_news_test
#   - Ensure that the provided .gitignore file contans the line .env.*
#   - Save any new/edited files.

# 4. Install dependencies:
#   - In nc-news directory, type in terminal:
#   - npm: 'npm init -y'
#   - Express: 'npm -i express'
#   - Dotenv:  'npm -i dotenv'
#   - node-pg-format: 'npm -i pg-format'
#   - For testing: jest: 'npm -i jest -D'
#   - supertest: 'npm -i supertest -D'

# 5. Seed database:
#   - In nc-news directory, type in terminal:
#   - 'npm run setup-dbs'
#   - Then, 'npm run seed'
#   - Database should now be seeded and ready to run

# 6. OPTIONAL: Run tests:
#   - Tests can be accessed in nc-news/\__tests__ folder
#   - To run all tests: in nc-news directory, type in terminal: 'npm test app'
#   - To run specific tests: in app.test.js file, add '.only' to describe (for groups of tests) or it (for select tests)
#   - e.g. test.only() will only run selected test