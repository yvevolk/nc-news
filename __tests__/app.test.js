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