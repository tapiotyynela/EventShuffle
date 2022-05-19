export type NewEventBody = {
  name: string;
  dates: string[];
};

export type SuitableDateResult = {
  date: string;
  people: string[];
};

export type EventResultsResponse = {
  id: number;
  name: string;
  suitableDates: SuitableDateResult[];
};
