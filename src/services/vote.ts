import sequelize from "../db"
import { Transaction } from "sequelize/types"
import { Request, Response } from "express"
import Vote from "../models/vote"
import VoteEventDate from "../models/voteEventDate"
import Person from "../models/person"
import EventDate from "../models/eventDate"
import { findOrCreatePerson } from "./person"
import { getEventById } from "./event"
import { findDateByEventIdAndDate } from "./eventDate"


const createVote = async (voteGiver: number, eventId: number, t?: Transaction) => {
    return Vote.create({
        person: voteGiver,
        event: eventId
    }, { transaction: t})
}

const createVoteEventDate = async (voteId: number, eventDateId: number, t?: Transaction) => {
    return VoteEventDate.create({
        voteId,
        eventDateId
    }, { transaction: t })
}

const getEventVotes = async (eventId: number) => {
    const votes = await Vote.findAll({
        where: {
            event: eventId
        },
        include: [
            {model: Person, attributes: ['name']},
            {model: EventDate, attributes: ['date']}
        ]
    })
    return votes
}

const addVoteToDates = async (vote: Vote, votes: string[], eventId: number, t: Transaction) => {
    await Promise.all(votes.map(async (v: string) => {
        const eventDate = await findDateByEventIdAndDate(eventId, v)
        await createVoteEventDate(vote.voteId, eventDate.eventDateId, t)
    }))
}

const groupVotesByDate = async (eventId: number, dates: any) => {
    const votes = await getEventVotes(eventId)
    const votedDates = dates.map(date => {
        let personsVotedDate = []
        votes.forEach(vote => {
            vote.EventDates.forEach(ed => {
                if (ed.date === date.date) {
                    personsVotedDate.push(vote.Person.name)
                }
            })
        })
        if (personsVotedDate.length > 0) {
            return {
                date: date.date,
                persons: personsVotedDate
            }
        }
    })
    return votedDates
}

export const addVote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params // eventId
        const { name, votes } = req.body // votes is array of date strings
        await sequelize.transaction(async (t) => {
            const event = await getEventById(parseInt(id))
            const person = await findOrCreatePerson(name, t)
            const vote = await createVote(person.personId, event.eventId, t)
            await addVoteToDates(vote, votes, event.eventId, t)
            const groupedVotes = await groupVotesByDate(event.eventId, event.EventDates)
            res.status(200).send({
                event,
                votes: groupedVotes
            })
        })
    } catch (error) {
        res.send('Something went wrong')
    }
}