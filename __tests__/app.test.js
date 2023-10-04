const app = require ('../app.js');
const request = require ('supertest');
const db = require ('../db/connection.js');
const seed = require ('../db/seeds/seed.js');
const data = require ('../db/data/test-data/index.js');

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    db.end()
})

describe('GET /api/topics', () => {
    it('returns status code 200 and array of topic objects with description and slug', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            expect(response.body.topics.length).toBe(3);
            response.body.topics.forEach((topic) => {
                expect(typeof topic.description).toBe('string');
                expect(typeof topic.slug).toBe('string');
            })
        })
    })
})

describe('invalid endpoint', () => {
    it('returns 404 and error message when attempting to get invalid endpoint', () => {
        return request(app)
        .get('/api/abc123')
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe('error, invalid endpoint')
        })
    })
})

describe('GET /api', () => {
    it('returns 200 with contents of endpoints.json as object', () => {
        return request(app)
        .get('/api/')
        .expect(200)
        .then((response) => {
            expect(typeof response.body.endpoints).toBe('object');
            expect(response.body.endpoints.hasOwnProperty('GET /api')).toBe(true)
            expect(response.body.endpoints.hasOwnProperty('GET /api/topics')).toBe(true)
            expect(response.body.endpoints.hasOwnProperty('GET /api/articles')).toBe(true)
            const requiredKeys = ['description', 'queries', 'exampleResponse']
            expect(Object.getOwnPropertyNames(response.body.endpoints['GET /api/topics'])).toEqual(requiredKeys)
        })
     })
    })

describe('GET /api/articles/:article_id', () => {
    it('returns 200 with correct article, in correct format, with correct keys', () => {
         return request(app)
         .get('/api/articles/2')
         .expect(200)
         .then((response) => {
            expect(Array.isArray(response.body.article)).toBe(true)
            expect(typeof response.body.article[0]).toBe('object');
            const requiredKeys = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url']
            expect(Object.getOwnPropertyNames(response.body.article[0])).toEqual(requiredKeys);
            expect(response.body.article[0].article_id).toBe(2)
         })
    })
    it('returns 404 and error message when passed nonexistent article id', () => {
        return request(app)
        .get('/api/articles/333')
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe('invalid article id')
        })
    })
    it ('returns 400 and error message when passed invalid article_id', () => {
        return request(app)
        .get('/api/articles/abcdefg')
        .expect(400)
        .then((response) => {
            expect(response.body.message).toBe('bad request')
        })
    })
    })

    describe.only('GET /api/articles', () => {
        it('returns 200 and array of correct article objects sorted by created_at DESC by default', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                expect(response.body.articles.length).toBe(13);
                expect(response.body.articles).toBeSortedBy('created_at', {descending: true});
                response.body.articles.forEach((article) => {
                    const requiredKeys = ['article_id', 'title', 'topic', 'author', 'created_at', 'votes', 'article_img_url', 'comment_count']
                    expect(Object.getOwnPropertyNames(article)).toEqual(requiredKeys);
                    expect(Object.getOwnPropertyNames(article)).not.toContain('body')
                })
            })
        })
        it('should have a correct comment_count', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                expect(response.body.articles[4].comment_count).toBe('0')
                expect(response.body.articles[5].comment_count).toBe('2')
                expect(response.body.articles[6].comment_count).toBe('11')
            })
        })
    })
    
describe('GET /api/articles/:article_id/comments', () => {
    it('returns 200 and array of comments for relevant article', () => {
        return request(app)
        .get('/api/articles/9/comments')
        .expect(200)
        .then((response) => {
            expect(Array.isArray(response.body.comments)).toBe(true);
            expect(response.body.comments.length).toBe(2);
            const requiredKeys = ['comment_id', 'votes', 'created_at', 'author', 'body', 'article_id']
            response.body.comments.forEach((comment) => {
                expect(Object.getOwnPropertyNames(comment)).toEqual(requiredKeys)
            })
            expect(response.body.comments).toBeSortedBy('created_at', {descending: true})
        })
    })
    it('returns 400 if article_id is invalid', () => {
        return request(app)
        .get('/api/articles/abc/comments')
        .expect(400)
        .then((response) => {
            expect(response.body.message).toBe('bad request')
        })
    })
    it('returns 404 if article_id is valid but does not exist', () => {
        return request(app)
        .get('/api/articles/2222/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.message).toEqual('article does not exist')
        })
    })
    it('returns 200 and empty array if article has no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual({"comments": []})
        })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    it('returns 201 and new comment when passed valid comment and article id', () => {
        const newComment = {body: 'My hovercraft is full of eels.', author: 'icellusedkars'};
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(201)
        .then((response) => {
            expect(response.body.comment.comment_id).toBe(19);
            expect(response.body.comment.body).toBe('My hovercraft is full of eels.');
            expect(response.body.comment.author).toBe('icellusedkars')
        })
    })
    it('returns 400 when passed username that does not exist', () => {
        const newComment = {body: 'I want to post a comment', author: 'idontexist'};
        return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.message).toBe('bad request')
        })
    })
    it('returns 400 when passed invalid article_id', () => {
        const newComment = {body: 'My hovercraft is full of eels.', author: 'icellusedkars'};
        return request(app)
        .post('/api/articles/abc/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.message).toBe('bad request')
        })
    })
    it('returns 404 when passed valid article_id that does not exist', () => {
        const newComment = {body: 'My hovercraft is full of eels.', author: 'icellusedkars'};
        return request(app)
        .post('/api/articles/2222/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe('not found')
        })
    })
})