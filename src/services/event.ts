import { isArraysEqual } from "../helpers/arrayHelpers";
import Event from "../models/event";
import EventDate from "../models/eventDate";
import Person from "../models/person";
import Vote from "../models/vote";
import { EventResultsResponse, SuitableDateResult } from "../types/event";

export const getAllEvents = async (): Promise<Event[]> => {
  return Event.findAll({ attributes: ["eventId", "name"] });
};

export const getEventById = async (id: number): Promise<Event> => {
  return Event.findOne({
    where: {
      eventId: id,
    },
    attributes: ["eventId", "name"],
    include: [{ model: EventDate }],
  });
};

export const findSuitableDateForEveryone = (
  voters: string[],
  dateOptions: SuitableDateResult[]
): SuitableDateResult[] => {
  let suitableDates: SuitableDateResult[] = [];
  dateOptions.forEach((d: SuitableDateResult) => {
    if (isArraysEqual(d.people, voters)) {
      suitableDates.push(d);
    }
  });
  return suitableDates;
};

// format peoples votes so we can see who have voted which date
export const formatFindMostSuitableDate = (
  eventDates: EventDate[]
): SuitableDateResult[] => {
  let allVoterNames: string[] = [];

  const formatted = eventDates.map((ed: EventDate) => {
    const names: string[] = ed.Votes.map((v) => v.Person.name);
    allVoterNames = allVoterNames.concat(names);

    return {
      date: ed.date,
      people: names,
    };
  });

  const allDistinctVoters: string[] = [...new Set(allVoterNames)];
  const suitableDates = findSuitableDateForEveryone(
    allDistinctVoters,
    formatted
  );
  return suitableDates;
};

export const findEventWithSuitableDates = async (
  eventId: number
): Promise<EventResultsResponse> => {
  const event = await Event.findOne({
    where: {
      eventId: eventId,
    },
    attributes: ["eventId", "name"],
    include: [
      {
        model: EventDate,
        attributes: ["date"],
        include: [
          {
            model: Vote,
            through: { attributes: [] },
            attributes: ["voteId"],
            include: [{ model: Person, attributes: ["name"] }],
          },
        ],
      },
    ],
  });

  const formattedVotingData = formatFindMostSuitableDate(event.EventDates);
  return {
    id: event.eventId,
    name: event.name,
    suitableDates: formattedVotingData,
  };
};

export const createEvent = async (name: string): Promise<Event> => {
  return Event.create({ name });
};
