const express = require('express');
const app = express();
const { getTopics } = require('./controllers/controllers.js')

app.get('/api/topics', getTopics);

app.all('/api/*', function (req, res, next) {
    res.status(404).send({message: 'error, invalid endpoint'})
})

module.exports = app;