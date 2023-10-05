const {fetchTopics, fetchArticleById, fetchArticles, fetchComments, addComment, updateArticle, fetchComment, removeComment, fetchUsers} = require('../models/models.js')
const fs = require('fs/promises')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
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
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {next(err)})
}

exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {
       res.status(200).send({articles})
    })
    .catch((err) => {next(err)})
}

exports.getComments = (req, res, next) => {
    const {article_id} = req.params;
    fetchArticleById(article_id).then(() => {
    fetchComments(article_id).then((comments) => {
        res.status(200).send({comments})
    })})
    .catch((err) => {next(err)})
}

exports.postComment = (req, res, next) => {
    const newComment = req.body;
    const {article_id} = req.params;
    addComment(newComment, article_id).then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {next(err)})
}

exports.patchArticle = (req, res, next) => {
    const changeVotesBy = req.body.inc_votes;
    const {article_id} = req.params;
    fetchArticleById(article_id).then(() => {
    updateArticle(changeVotesBy, article_id).then((article) => {
        res.status(200).send({article})
    })})
    .catch((err) => next(err))
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params;
    fetchComment(comment_id).then(() => {
    removeComment(comment_id).then(() => {
        res.status(204).send();
    })})
    .catch((err) => {next(err)})}

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({users});
    })
}