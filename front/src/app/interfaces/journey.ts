import {JourneySection} from "./journey-section";

export interface Journey {
  departure : Date;
  arrival : Date;
  sections : Array<JourneySection>
}
