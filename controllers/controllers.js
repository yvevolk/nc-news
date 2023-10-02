const { fetchTopics } = require('../models/models.js')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((result) => {
        res.status(200).send({topics: result})
    })
}