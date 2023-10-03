const { fetchTopics, fetchArticleById, fetchArticles, fetchComments} = require('../models/models.js')
const fs = require('fs/promises')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((result) => {
        res.status(200).send({topics: result})
    })
    .catch((err) => {next(err)})
}

exports.getEndpointsInfo = (req, res, next) => {
    fs.readFile(`${__dirname}/../endpoints.json`)
    .then ((result) => {
       res.status(200).send({endpoints: JSON.parse(result)})
    })
    .catch((err) => {next(err)})
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticleById(article_id).then((result) => {
        res.status(200).send({article: result})
    })
    .catch((err) => {next(err)})
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then((result) => {
       res.status(200).send({articles: result})
    })
    .catch((err) => {next(err)})
}

exports.getComments = (req, res, next) => {
    const {article_id} = req.params;
    fetchComments(article_id).then((comments) => {
        if (comments.length === 0){
            res.status(200).send({comments})
        }
        else {
        res.status(200).send({comments})}
    })
    .catch((err) => {next(err)})
}