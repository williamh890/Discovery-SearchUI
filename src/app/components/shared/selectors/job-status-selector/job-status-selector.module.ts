import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSharedModule } from '@shared';
import { MatSelectModule } from '@angular/material/select';

import { JobStatusSelectorComponent } from './job-status-selector.component';



@NgModule({
  declarations: [JobStatusSelectorComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatSharedModule,
    MatSelectModule,
  ],
  exports: [
    JobStatusSelectorComponent
  ]
})
export class JobStatusSelectorModule { }
