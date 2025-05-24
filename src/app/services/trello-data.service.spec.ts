import { TestBed } from '@angular/core/testing';

import { TrelloDataService } from './trello-data.service';

describe('TrelloDataService', () => {
  let service: TrelloDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrelloDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
