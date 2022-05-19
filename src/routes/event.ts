import express from 'express'
const router = express.Router()

import { getEvents, createEvent, getEventByIdWithDates } from '../services/event'
import { addVote } from '../services/vote'

// POST
router.post('/event', createEvent)
router.post('/event/:id/vote', addVote)

// GET
router.get('/event/list', getEvents)
router.get('/event/:id', getEventByIdWithDates)


export default router