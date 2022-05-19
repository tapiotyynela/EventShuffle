import express, { Request, Response } from "express";
import sequelize from "../db";
import { doesArrayContainValues } from "../helpers/arrayHelpers";
import {
  getAllEvents,
  getEventById,
  createEvent,
  findEventWithSuitableDates,
} from "../services/event";
import { createEventDates, findDatesOfEvent } from "../services/eventDate";
import { findOrCreatePerson } from "../services/person";
import { addVoteToDates, createVote, groupVotesByDate } from "../services/vote";
import { NewEventBody } from "../types/event";

const router = express.Router();

// POST ENDPOINTS
router.post("/event", async (req: Request, res: Response) => {
  try {
    const { name, dates }: NewEventBody = req.body;
    const newEvent = await createEvent(name);
    await createEventDates(dates, newEvent.eventId);
    return res.status(200).send({ id: newEvent.eventId });
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

router.post("/event/:id/vote", async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // eventId
    const { name, votes } = req.body; // votes is array of date strings
    const event = await sequelize.transaction(async (t) => {
      const event = await getEventById(parseInt(id));
      const person = await findOrCreatePerson(name, t);
      const vote = await createVote(person.personId, event.eventId, t);
      // check if user sends correct dates that belong to event
      if (
        doesArrayContainValues(
          event.EventDates.map((d) => d.date),
          votes
        )
      ) {
        await addVoteToDates(vote, votes, event.eventId, t);
      } else {
        res.status(400).send("Invalid dates");
      }
      return event;
    });

    const groupedVotes = await groupVotesByDate(
      event.eventId,
      event.EventDates
    );

    res.status(200).send({
      id: event.eventId,
      name: event.name,
      dates: event.EventDates.map((d) => d.date),
      votes: groupedVotes.filter((v) => v),
    });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// GET ENDPOINTS
router.get("/event/list", async (req: Request, res: Response) => {
  try {
    const events = await getAllEvents();
    return res.send({ events });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.get("/event/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id);
    const event = await getEventById(eventId);
    const eventDates = await findDatesOfEvent(eventId);
    const groupedVotes = await groupVotesByDate(
      event.eventId,
      event.EventDates
    );
    return res.status(200).send({
      id: event.eventId,
      name: event.name,
      dates: eventDates.map((ed) => ed.date),
      votes: groupedVotes.filter((v) => v),
    });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.get("/event/:id/results", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const eventWithSuitableDates = await findEventWithSuitableDates(
      parseInt(id)
    );

    res.send(eventWithSuitableDates);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

export default router;
