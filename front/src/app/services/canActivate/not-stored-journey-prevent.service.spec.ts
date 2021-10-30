import { TestBed } from '@angular/core/testing';

import { NotStoredJourneyPreventService } from './not-stored-journey-prevent.service';

describe('NotStoredJourneyPreventService', () => {
  let service: NotStoredJourneyPreventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotStoredJourneyPreventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
