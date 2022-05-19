import { Request, Response } from "express"
import { format } from "sequelize/types/utils"
import {isArraysEqual} from "../helpers/arrayHelpers"
import Event from '../models/event'
import EventDate from "../models/eventDate"
import Person from "../models/person"
import Vote from "../models/vote"

export const getAllEvents = async () => {
    return Event.findAll({attributes: ['eventId', 'name']})
}

export const getEventById = async (id: number) => {
    const event = await Event.findOne({
        where: {
            eventId: id
        },
        attributes: ['eventId', 'name'],
        include: [{model: EventDate}]
    })
    return event
}

export const findSuitableDateForEveryone = (voters: string[], dateOptions: {date: string, people: string[]}[]) => {
    let suitableDates = []
    dateOptions.forEach(d => {
        if (isArraysEqual(d.people, voters)) {
            suitableDates.push(d)
        }
    })
    return suitableDates
}

const findMostSuitableDate = (eventDates: EventDate[]) => {
    let allVoterNames = []
    const formatted =  eventDates.map(ed => {
        const names = ed.Votes.map(v => v.Person.name)
        allVoterNames = allVoterNames.concat(names)
        return {
            date: ed.date,
            people: names
        }
    })
    const allDistinctVoters = [... new Set(allVoterNames)]
    const suitableDates = findSuitableDateForEveryone(allDistinctVoters, formatted)
    return suitableDates
}

const findEventWithSuitableDates = async (eventId: number) => {
    const event = await Event.findOne({
        where: {
            eventId: eventId
        },
        attributes: ['eventId', 'name'],
        include: [
            {model: EventDate, attributes: ['date'], include: [
                {model: Vote, through: {attributes: []}, attributes: ['voteId'], include: [
                    {model: Person, attributes: ['name']}]}]}]
    })

    const formattedVotingData = findMostSuitableDate(event.EventDates)
    return {
        id: event.eventId,
        name: event.name,
        suitableDates: formattedVotingData
    }
}

export const createEvent = async (name: string) => {
    return Event.create({name})    
}

export const getEventResults = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const eventWithSuitableDates = await findEventWithSuitableDates(parseInt(id))

        res.send(eventWithSuitableDates)
    } catch (error) {
        res.status(500).send('Something went wrong')
    }
}