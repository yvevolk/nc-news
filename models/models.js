const db = require('../db/connection.js')

exports.fetchTopics = () => {
 return db.query(`SELECT * FROM topics;`).then(({rows}) => {
    return rows
 })
}

exports.fetchArticleById = (article_id) => {
   return db.query("SELECT * FROM articles WHERE article_id=$1;", [article_id])
   .then(({rows}) => {
      if (rows.length === 0){
         return Promise.reject({
            status: 404,
            message: 'invalid article id'
         })
      }
      return rows;
   })
}

exports.fetchArticles = () => {
   return db.query(`SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC`).then(({rows}) => {
      return rows
   })
}

exports.fetchComments = (article_id) => {
   return db.query(`SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id =$1 ORDER BY created_at DESC;`, [article_id]).then(({rows}) => {
      if (typeof (parseInt(article_id)) === 'number' && rows.length === 0){
         return db.query(`SELECT article_id FROM articles WHERE article_id = $1;`, [article_id]).then(({rows}) => {
            if (rows.length){
               return []
            }
            else {
              return Promise.reject({
                  status: 404,
                  message: 'article does not exist'
               })
            }
         })
      }
  return rows
   })
}

exports.addComment = (comment, article_id) => {
   return db.query(`SELECT * FROM users WHERE username = $1`, [comment.author])
   .then(({rows}) => {
      if (rows.length){
         return db.query(`INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`, [comment.body, comment.author, article_id])
         .then(({rows}) => {
            return rows[0];
         })
      }
      else {return Promise.reject({
         status: 400,
         message: 'bad request'
      })}
   })
}

exports.updateArticle = (num, article_id) => {
   return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
   .then(({rows}) => {
      if (rows.length){
         return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [num, article_id])
         .then(({rows}) => {
            return rows;
         })
      }
      else {return Promise.reject({
         status: 404,
         message: 'not found'
      })}
   })
}