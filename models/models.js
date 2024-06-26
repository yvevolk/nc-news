const db = require('../db/connection.js')

const fetchTopics = () => {
 return db.query(`SELECT * FROM topics;`).then(({rows}) => {
    return rows
 })
}

const fetchArticleById = (article_id) => {
   return db.query("SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id HAVING articles.article_id = $1 ORDER BY articles.created_at DESC;", [article_id])
   .then(({rows}) => {
      if (rows.length === 0){
         return Promise.reject({
            status: 404,
            message: 'not found'
         })
      }
      return rows;
   })
}

const checkTopicExists = (topic) => {
if (topic === undefined){
   return Promise.resolve({
   })
}
   return db.query(`SELECT * FROM topics WHERE slug=$1`, [topic])
      .then(({rows}) => {
         if (rows.length === 0){
            return Promise.reject({
               status: 404,
               message: 'not found'
            })
         }
         return rows
      })
}

const fetchArticles = (query) => {
   let queryString =  `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id `
   if (!Object.keys(query).includes('topic') && Object.keys(query).length > 0){
      return Promise.reject({
         status: 400,
         message: 'bad request'
      })
   }
   else if (Object.keys(query).length > 0){
      return checkTopicExists(query.topic).then(()=> {
             queryString += (`HAVING topic = $1 ORDER BY articles.created_at DESC;`)
         return db.query(queryString, [query.topic])})
         .then(({rows}) => {
      return rows
   })
}
else {
   queryString += (` ORDER BY articles.created_at DESC;`)
   return db.query(queryString).then(({rows}) => {
      return rows
   })
}
   }


const fetchComments = (article_id) => {
   return db.query(`SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id =$1 ORDER BY created_at DESC;`, [article_id]).then(({rows}) => {
  return rows
   })
}

const addComment = (comment, article_id) => {
         return db.query(`INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`, [comment.body, comment.author, article_id])
         .then(({rows}) => {
            return rows[0];
         })

}

const fetchComment = (comment_id) => {
      return db.query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
      .then(({rows}) => {
         if (rows.length === 0){
         return Promise.reject({
            status: 404,
            message: 'not found'
         })
      }
         return rows
      })
   }


const updateArticle = (num, article_id) => {
         return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [num, article_id])
         .then(({rows}) => {
            return rows;
         })
   }

const updateComment = (num, comment_id) => {
   return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`, [num, comment_id])
   .then(({rows}) => {
      return rows;
   })
}


const removeComment = (comment_id) => {
         return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
      }

const fetchUsers = () => {
   return db.query('SELECT * FROM users')
   .then(({rows}) => {
      return rows
   })
}

module.exports = {fetchTopics, fetchArticleById, checkTopicExists, fetchArticles, fetchComments, addComment, updateArticle, updateComment, fetchComment, removeComment, fetchUsers}