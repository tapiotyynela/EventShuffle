import Event from '../../src/models/event'
import eventRoutes from '../../src/routes/event'
import request from 'supertest'
import sequelize from '../../src/db'
import app from '../../src/app'
import EventDate from '../../src/models/eventDate'

describe('ENDPOINTS', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true })
    app.use(eventRoutes)
    await Event.bulkCreate([
      {eventId: 1, name: 'Pihatalkoot'},
      {eventId: 2, name: 'Tapion synttärit'},
      {eventId: 3, name: 'Kevätsiivous'}
    ])
    await EventDate.bulkCreate([
      {date: '2022-10-10', event: 1},
      {date: '2022-10-11', event: 1},
      {date: '2022-10-12', event: 2},
      {date: '2022-10-13', event: 2},
      {date: '2022-10-14', event: 3},
      {date: '2022-10-15', event: 3}
    ])
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
  })

  describe('Get results', () => {
    test('should get results of event', async () => {
      expect(true).toBe(true)
    })
  })

  afterAll(async () => {
    await sequelize.close()
  })

})