export interface JourneySection {
  type: string;
  from: string;
  to: string;
  mode: string;
  departure: Date;
  arrival: Date;
  duration: string;
}
