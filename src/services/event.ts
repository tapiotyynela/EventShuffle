import { Request, Response } from "express"
import Event from '../models/event'
import EventDate from "../models/eventDate"
import Vote from "../models/vote"
import { NewEvent } from "../types/event"

export const getEvents = async (req: Request, res: Response) => {
    try {
        const allEvents = await Event.findAll()
        res.status(200).send({events: allEvents})
    } catch (error) {
        res.send('Something went wrong')
    }
}

export const getEventById = async (id: number) => {
    const event = await Event.findOne({
        where: {
            eventId: id
        },
        attributes: ['eventId', 'name'],
        include: [{model: EventDate, attributes: ['date']}]
    })
    return event
}

export const getEventByIdWithDates = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const event = await Event.findOne({where: {
            eventId: id
        }})
        const eventDates = await EventDate.findAll({
            where: {
                event: event.eventId
            },
            include: Vote
        })
        res.status(200).send({
            event,
            dates: eventDates.map(ed => ed.date)
        })
    } catch (error) {
        res.send('Something went wrong')
    }
}

export const createEvent = async (req: Request, res: Response) => {
    try {
        const { name, dates }: NewEvent = req.body
        console.log("NIMI", name)
        const newEvent = await Event.create({ name })
        console.log("EVENTTI", newEvent)
        await Promise.all(dates.map(async (date) => {
            await EventDate.create({
                date,
                event: newEvent.eventId
            })
        }))
        res.status(200).send({ id: newEvent.eventId })
    } catch (error) {
        res.status(400).send('Something went wrong')
    }
}