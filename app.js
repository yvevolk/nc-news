const express = require('express');
const app = express();
const {getTopics, getEndpointsInfo, getArticleById, getArticles, getComments, postComment, patchArticle, deleteComment, getUsers} = require('./controllers/controllers.js')

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/', getEndpointsInfo);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getComments);

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', patchArticle);

app.delete('/api/comments/:comment_id', deleteComment);

app.get('/api/users', getUsers);

app.all('/api/*', function (req, res, next) {
    res.status(404).send({message: 'error, invalid endpoint'})
})


app.use((err, req, res, next) => {
    if (err.status && err.message){
        res.status(err.status).send({message: err.message})}
    else if (err.code === '22P02' || err.code === '23502'){
        res.status(400).send({message: 'bad request'})}
    else if (err.code === '23503'){
        res.status(404).send({message: 'not found'})}
    else {console.log(err)
        res.status(500).send({message: 'internal server error' })}
});


module.exports = app;