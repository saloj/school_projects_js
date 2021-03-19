require('dotenv').config();

const PORT = process.env.PORT;
const DB_PORT = process.env.DB_PORT;
const SECRET_PASSWORD = process.env.SECRET_PASSWORD;
const DATABASE = process.env.DATABASE;

module.exports = {
  SECRET_PASSWORD,
  PORT,
  DB_PORT,
  DATABASE
};
