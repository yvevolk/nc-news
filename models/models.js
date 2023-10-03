const db = require('../db/connection.js')

exports.fetchTopics = () => {
 return db.query(`SELECT * FROM topics;`).then(({rows}) => {
    return rows
 })
}

exports.fetchArticleById = (article_id) => {
   return db.query("SELECT * FROM articles WHERE article_id=$1;", [article_id])
   .then(({rows}) => {
      return rows;
   })
}

exports.fetchArticles = () => {
   return db.query(`SELECT * FROM articles;`).then(({rows}) => {
      return rows
   })
}