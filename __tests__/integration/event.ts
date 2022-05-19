import Event from '../../src/models/event'
import eventRoutes from '../../src/routes/event'
import request from 'supertest'
import sequelize from '../../src/db'
import app from '../../src/app'
import EventDate from '../../src/models/eventDate'
import Person from '../../src/models/person'
import Vote from '../../src/models/vote'
import VoteEventDate from '../../src/models/voteEventDate'

const populateDatabase = async () => {
  await Event.create({eventId: 1, name: 'Pihatalkoot'})
  await Person.bulkCreate([
    {personId: 1, name: 'Pertti'},
    {personId: 2, name: 'Sanna'}
  ])
  await EventDate.bulkCreate([
    {eventDateId: 1, date: '2022-10-10', event: 1},
    {eventDateId: 2, date: '2022-10-11', event: 1},
  ])
  await Vote.bulkCreate([
    {voteId: 1, person: 1, event: 1},
    {voteId: 2, person: 1, event: 1},
    {voteId: 3, person: 2, event: 1},
  ])
  await VoteEventDate.bulkCreate([
    {voteId: 1, eventDateId: 1},
    {voteId: 2, eventDateId: 2},
    {voteId: 3, eventDateId: 1}
  ])
}

describe('EVENT ENDPOINTS', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true })
    app.use(eventRoutes)
    await populateDatabase()
  })
  
  describe('Get event by id with dates', () => {
    test('should return event with array of dates', async () => {
      const response = await request(app)
        .get('/event/1')
      expect(response.status).toEqual(200)
      expect(response.body).not.toBeNull()
      expect(response.body.dates).toEqual([
        '2022-10-10',
        '2022-10-11'
      ])
    })

    test('should return error message if id is invalid', async () => {
      const response = await request(app)
        .get('/event/2')
        expect(response.status).toEqual(500)
    })
  })

  describe('Get results of an event', () => {
    test('should return event and the date that is suitable for all participants', async () => {
      const response = await request(app)
      .get('/event/1/results')
      expect(response.status).toEqual(200)
      expect(response.body).not.toBeNull()
      expect(response.body.suitableDates).toEqual([
        {
          date: '2022-10-10',
          people: [
            'Pertti',
            'Sanna'
          ]
        }
      ])
    })

    test('should return error message if id is invalid', async () => {
      const response = await request(app)
        .get('/event/2/results')
        expect(response.status).toEqual(500)
    })
  })

  afterAll(async () => {
    await sequelize.close()
  })

})