import EventDate from "../models/eventDate"

export const findDateByEventIdAndDate = async (eventId: number, date: string) => {
    const eventDate = await EventDate.findOne({
        where: {
            event: eventId,
            date
        }
    })
    return eventDate
}

export const findDatesOfEvent = async (eventId: number) => {
    const eventDates = await EventDate.findAll({
        where: {
            event: eventId,
        }
    })
    return eventDates
}