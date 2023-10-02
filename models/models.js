const db = require('../db/connection.js')

exports.fetchTopics = () => {
 const query = `SELECT * from TOPICS;`
 return db.query(query).then(({rows}) => {
    return rows
 })
}