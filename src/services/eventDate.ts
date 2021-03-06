import EventDate from "../models/eventDate";
import Vote from "../models/vote";

export const findDateByEventIdAndDate = async (
  eventId: number,
  date: string
): Promise<EventDate> => {
  const eventDate = await EventDate.findOne({
    where: {
      event: eventId,
      date,
    },
  });
  return eventDate;
};

export const findDatesOfEvent = async (
  eventId: number
): Promise<EventDate[]> => {
  return await EventDate.findAll({
    where: {
      event: eventId,
    },
    include: Vote,
  });
};

export const createEventDates = async (
  dates: string[],
  eventId: number
): Promise<void[]> => {
  return Promise.all(
    dates.map(async (date) => {
      await EventDate.create({
        date,
        event: eventId,
      });
    })
  );
};
