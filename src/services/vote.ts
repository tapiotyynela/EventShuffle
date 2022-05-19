import { Transaction } from "sequelize/types"
import { Request, Response } from "express"
import Vote from "../models/vote"
import VoteEventDate from "../models/voteEventDate"
import Person from "../models/person"
import EventDate from "../models/eventDate"
import { findDateByEventIdAndDate } from "./eventDate"

export const createVote = async (voteGiver: number, eventId: number, t?: Transaction) => {
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

export const addVoteToDates = async (vote: Vote, votes: string[], eventId: number, t: Transaction) => {
    const dates = await Promise.all(votes.map(async (v: string) => {
        const eventDate = await findDateByEventIdAndDate(eventId, v)
        await createVoteEventDate(vote.voteId, eventDate.eventDateId, t)
        return eventDate.date
    }))
    return dates
}

export const groupVotesByDate = async (eventId: number, dates: EventDate[]) => {
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
                people: personsVotedDate
            }
        }
    })
    return votedDates
}