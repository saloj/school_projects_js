const app = require('./app');
const db = require('./db');
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

// commented segments were only used during testing

// const dropTables = async () => {
//   return new Promise((resolve, reject) => {
//     const dropTables_sql = 'DROP TABLE IF EXISTS users, posts, comments';

//     db.conn.query(dropTables_sql, (err, result) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve(result);
//     });
//   });
// };

// const dropViews = async () => {
//   return new Promise((resolve, reject) => {
//     const dropview_sql = 'DROP VIEW IF EXISTS post_view, comment_view';

//     db.conn.query(dropview_sql, (err, result) => {
//       if (err) {
//         return reject(err);
//       }
//       return resolve(result);
//     });
//   });
// };

// async function init() {
//   await dropTables();
//   console.log('Tables dropped!');
//   await db.setup.users();
//   await db.setup.posts();
//   await db.setup.comments();
//   await dropViews();
//   console.log('Views dropped!');
//   await db.setup.postView();
//   await db.setup.commentView();
// }

// init();
