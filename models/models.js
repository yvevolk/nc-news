const db = require('../db/connection.js')

exports.fetchTopics = () => {
 const query = `SELECT * FROM topics;`
 return db.query(query).then(({rows}) => {
    return rows
 })
}

exports.fetchArticleById = (article_id) => {
   return db.query("SELECT * FROM articles WHERE article_id=$1;", [article_id])
   .then(({rows}) => {
      return rows;
   })
}