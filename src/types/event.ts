export type NewEvent = {
  name: string;
  dates: string[];
};

export interface Event {
  eventId: number;
  name: string;
  EventDates: { date: string }[];
}
