const db = require('../db/connection.js')

exports.fetchTopics = () => {
 return db.query(`SELECT * FROM topics;`).then(({rows}) => {
    return rows
 })
}

exports.fetchArticleById = (article_id) => {
   return db.query("SELECT * FROM articles WHERE article_id=$1;", [article_id])
   .then((result) => {
      if (result.rows.length === 0){
         return Promise.reject({
            status: 404,
            message: 'invalid article id'
         })
      }
      return result.rows;
   })
}

exports.fetchArticles = () => {
   const queryString = `SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC`
   return db.query(queryString).then(({rows}) => {
      return rows
   })
}