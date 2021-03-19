const mysql = require('mysql2');
const config = require('./utils/config');

const conn = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: config.SECRET_PASSWORD,
  port: config.DB_PORT,
  database: config.DATABASE
});

const setupUserTable = () => {
  return new Promise((resolve, reject) => {
    const createUserTable = `CREATE TABLE IF NOT EXISTS users(
    id VARCHAR(50) NOT NULL, 
    email VARCHAR(50) NOT NULL, 
    created_date DATETIME, 
    PRIMARY KEY(id))`;

    conn.query(createUserTable, function (err, result) {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

const setupPostTable = () => {
  return new Promise((resolve, reject) => {
    const createPostTable = `CREATE TABLE IF NOT EXISTS posts(
    id INT AUTO_INCREMENT, 
    user_id VARCHAR(50) NOT NULL, 
    title VARCHAR(50) NOT NULL, 
    content TEXT NOT NULL, 
    created_date DATETIME, 
    PRIMARY KEY(id), 
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)`;

    conn.query(createPostTable, function (err, result) {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

const setupCommentTable = () => {
  return new Promise((resolve, reject) => {
    const createCommentTable = `CREATE TABLE IF NOT EXISTS comments(
    id INT AUTO_INCREMENT, 
    user_id VARCHAR(50) NOT NULL, 
    post_id INT NOT NULL, 
    content TEXT NOT NULL, 
    created_date DATETIME, 
    PRIMARY KEY(id), 
    FOREIGN KEY(user_id) REFERENCES users(id), 
    FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE)`;

    conn.query(createCommentTable, function (err, result) {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

const setupPostsView = () => {
  return new Promise((resolve, reject) => {
    const createPostView = `CREATE VIEW post_view AS 
  SELECT posts.title, posts.content, posts.created_date, posts.id, posts.user_id, users.email FROM posts JOIN users ON posts.user_id = users.id`;

    conn.query(createPostView, function (err, result) {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

const setupCommentsView = () => {
  return new Promise((resolve, reject) => {
    const createCommentView = `CREATE VIEW comment_view AS 
  SELECT comments.content, comments.created_date, comments.post_id, comments.id, users.email FROM comments JOIN users ON comments.user_id = users.id`;

    conn.query(createCommentView, function (err, result) {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

const setup = {
  users: setupUserTable,
  posts: setupPostTable,
  comments: setupCommentTable,
  postView: setupPostsView,
  commentView: setupCommentsView
};

module.exports = { conn, setup };
