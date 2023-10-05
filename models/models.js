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

/* SELECT authors.author_name, COUNT(book_id) AS number_of_books
FROM authors
LEFT JOIN books ON books.author_id = authors.author_id
GROUP BY authors.author_id; */


exports.fetchArticles = () => {
   return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`).then(({rows}) => {
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
         return db.query(`INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;`, [comment.body, comment.author, article_id])
         .then(({rows}) => {
            return rows[0];
         })
   }