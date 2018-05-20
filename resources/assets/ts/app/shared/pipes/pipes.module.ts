import { NgModule } from '@angular/core';

import { ConverttimestampPipe } from './convert-timestamp.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [],
  declarations: [
    ConverttimestampPipe,
    SafePipe
  ],
  exports: [
    ConverttimestampPipe,
    SafePipe
  ],
})
export class PipesModule { }
