const express = require('express');
const app = express();
const { getTopics, getEndpointsInfo } = require('./controllers/controllers.js')

app.get('/api/topics', getTopics);

app.get('/api/', getEndpointsInfo);

app.all('/api/*', function (req, res, next) {
    res.status(404).send({message: 'error, invalid endpoint'})
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({message: 'internal server error' })
});


module.exports = app;