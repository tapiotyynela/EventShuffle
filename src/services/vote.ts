import { Transaction } from "sequelize/types";
import Vote from "../models/vote";
import VoteEventDate from "../models/voteEventDate";
import Person from "../models/person";
import EventDate from "../models/eventDate";
import { findDateByEventIdAndDate } from "./eventDate";
import { SuitableDateResult } from "../types/event";

export const createVote = async (
  voteGiver: number,
  eventId: number,
  t?: Transaction
): Promise<Vote> => {
  return Vote.create(
    {
      person: voteGiver,
      event: eventId,
    },
    { transaction: t }
  );
};

const createVoteEventDate = async (
  voteId: number,
  eventDateId: number,
  t?: Transaction
): Promise<VoteEventDate> => {
  return VoteEventDate.create(
    {
      voteId,
      eventDateId,
    },
    { transaction: t }
  );
};

const getEventVotes = async (eventId: number): Promise<Vote[]> => {
  return Vote.findAll({
    where: {
      event: eventId,
    },
    include: [
      { model: Person, attributes: ["name"] },
      { model: EventDate, attributes: ["date"] },
    ],
  });
};

export const addVoteToDates = async (
  vote: Vote,
  votes: string[],
  eventId: number,
  t: Transaction
): Promise<string[]> => {
  return Promise.all(
    votes.map(async (v: string) => {
      const eventDate = await findDateByEventIdAndDate(eventId, v);
      await createVoteEventDate(vote.voteId, eventDate.eventDateId, t);
      return eventDate.date;
    })
  );
};

export const groupVotesByDate = async (
  eventId: number,
  dates: EventDate[]
): Promise<SuitableDateResult[]> => {
  const votes = await getEventVotes(eventId);
  const votedDates = dates.map((date) => {
    let personsVotedDate = [];
    votes.forEach((vote) => {
      vote.EventDates.forEach((ed) => {
        if (ed.date === date.date) {
          personsVotedDate.push(vote.Person.name);
        }
      });
    });
    if (personsVotedDate.length > 0) {
      return {
        date: date.date,
        people: personsVotedDate,
      };
    }
  });
  return votedDates;
};
