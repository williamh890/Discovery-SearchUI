import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import { ConfirmationComponent } from '@components/header/processing-queue/confirmation/confirmation.component';

import * as services from '@services';
import * as models from '@models';
import { QueuedHyp3Job, Hyp3ableProductByJobType } from '@models';
import { AppState } from '@store';
import { Store } from '@ngrx/store';

import * as queueStore from '@store/queue';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {
  @Input() scene: models.CMRProduct;
  @Input() searchType: models.SearchType;

  @Input() isSelected: boolean;
  @Input() offsets: {temporal: 0, perpendicular: number};

  @Input() isQueued: boolean;
  @Input() jobQueued: boolean;
  @Input() numQueued: number;
  @Input() hyp3ableByJobType: {hyp3able: Hyp3ableProductByJobType[], total: number};

  @Output() zoomTo = new EventEmitter();
  @Output() toggleScene = new EventEmitter();
  @Output() ToggleOnDemandScene: EventEmitter<QueuedHyp3Job> = new EventEmitter();

  public hovered: boolean;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public copyIcon = faCopy;
  public SearchTypes = models.SearchType;

  public validateOnly = false;

  constructor(
    public env: services.EnvironmentService,
    private screenSize: services.ScreenSizeService,
    private hyp3: services.Hyp3Service,
    private store$: Store<AppState>,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.screenSize.breakpoint$.subscribe(
      breakpoint => this.breakpoint = breakpoint
    );
  }

  public onSetFocused(): void {
    this.hovered = true;
  }

  public onClearFocused(): void {
    this.hovered = false;
  }


  public withOffset(val: number, offset: number): number {
    return Math.trunc(val + offset);
  }

  public onZoomTo(): void {
    this.zoomTo.emit();
  }

  public onToggleScene(): void {
    this.toggleScene.emit();
  }

  public onToggleOnDemandScene(): void {
    this.ToggleOnDemandScene.emit({
      granules: [ this.scene ],
      job_type: models.hyp3JobTypes.RTC_GAMMA
    } as QueuedHyp3Job);
  }

  public isDownloadable(product: models.CMRProduct): boolean {
    return this.hyp3.isDownloadable(product);
  }

  public queueExpiredHyp3Job() {
    const job_types = models.hyp3JobTypes;
    const job_type = Object.keys(job_types).find(id =>
      {
        return this.scene.metadata.job.job_type === id as any;
      });

    this.store$.dispatch(new queueStore.AddJob({
      granules: this.scene.metadata.job.job_parameters.scenes,
      job_type: job_types[job_type]
    }));
  }

  public getExpiredHyp3ableObject(): {byJobType: models.Hyp3ableProductByJobType[], total: number} {
    const job_types = models.hyp3JobTypes;
    const job_type = Object.keys(job_types).find(id =>
      {
        return this.scene.metadata.job.job_type === id as any;
      });

    let byJobType: Hyp3ableProductByJobType[] = [];

    let temp: models.Hyp3ableByProductType = {
      productType: this.scene.metadata.job.job_type as any,
      products: [this.scene.metadata.job.job_parameters.scenes]
    };

    let byProductType: models.Hyp3ableByProductType[] = [];
    byProductType.push(temp);

    let hp = {
      byProductType,
      total: 1,
      jobType: job_types[job_type]
    } as models.Hyp3ableProductByJobType
    byJobType.push(hp);
    // byJobType.push(byProductType);

    const output = {
      byJobType,
      total: 1
    } as {byJobType: models.Hyp3ableProductByJobType[], total: number}

    return output;
  }

  public onSubmitQueue(jobTypesWithQueued, validateOnly: boolean) {
    console.log(jobTypesWithQueued);
    console.log(validateOnly);
    // const hyp3JobsBatch = this.hyp3.formatJobs(jobTypesWithQueued, {
    //   projectName: this.projectName,
    //   processingOptions: this.processingOptions
    // });
  }

  public onReviewQueue() {

    const job_types = models.hyp3JobTypes;
    const job_type = Object.keys(job_types).find(id =>
      {
        return this.scene.metadata.job.job_type === id as any;
      });

      // this.scene.metadata.job.job_parameters

    const confirmationRef = this.dialog.open(ConfirmationComponent, {
      id: 'ConfirmProcess',
      width: '350px',
      height: '500px',
      maxWidth: '350px',
      maxHeight: '500px',
      data: [{
        jobType: job_types[job_type],
        selected: true,
        jobs: [{
          granules: this.scene.metadata.job.job_parameters.scenes,
          job_type: job_types[job_type]
        } as QueuedHyp3Job ]
      }]
    });

    confirmationRef.afterClosed().subscribe(
      jobTypesWithQueued => {
        if (!jobTypesWithQueued) {
          return;
        }

        if (this.env.maturity === 'prod') {
          this.validateOnly = false;
        }

        this.onSubmitQueue(
          jobTypesWithQueued,
          this.validateOnly
        );
      }
    );
  }

  public onValidateOnlyToggle(val: boolean): void {
    this.validateOnly = val;
  }

  public isExpired(job: models.Hyp3Job): boolean {
    return this.hyp3.isExpired(job);
  }
}
