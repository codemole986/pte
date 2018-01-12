import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
	beforeEach(() => {
    	TestBed.configureTestingModule({
    		imports: [ RouterTestingModule ],
      		providers: [AuthGuard]
    	});
	});

	it('should be created', inject([AuthGuard], (guard: AuthGuard) => {
		expect(guard).toBeTruthy();
	}));
});
