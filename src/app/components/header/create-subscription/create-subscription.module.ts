import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatSharedModule } from '@shared';

import { SearchFiltersModule } from '@components/sidebar/saved-searches/saved-search/search-filters';
import { DateSelectorModule } from '@components/shared/selectors/date-selector';
import { ProjectNameSelectorModule } from '@components/shared/selectors/project-name-selector';
import { ProductTypeSelectorModule } from '@components/shared/selectors/product-type-selector';
import { AoiOptionsModule } from '@components/shared/aoi-options';

import { CreateSubscriptionComponent } from './create-subscription.component';
import { ProcessingOptionsModule } from '../processing-queue/processing-options';

import { MatDialogModule } from '@angular/material/dialog';
import { PipesModule } from '@pipes';

@NgModule({
  declarations: [
    CreateSubscriptionComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSelectModule,
    MatStepperModule,
    MatInputModule,
    MatSharedModule,
    ProcessingOptionsModule,
    SearchFiltersModule,
    DateSelectorModule,
    ProjectNameSelectorModule,
    ProductTypeSelectorModule,
    AoiOptionsModule,
    PipesModule,
  ],
  exports: [
    CreateSubscriptionComponent
  ]
})
export class CreateSubscriptionModule { }
