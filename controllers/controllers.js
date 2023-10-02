const { fetchTopics } = require('../models/models.js')
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