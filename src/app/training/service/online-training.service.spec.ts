import { TestBed } from '@angular/core/testing';

import { OnlineTrainingService } from './online-training.service';

describe('OnlineTrainingService', () => {
  let service: OnlineTrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineTrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
