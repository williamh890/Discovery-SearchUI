import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as scenesStore from '@store/scenes';

import { Breakpoints, CMRProductPair } from '@models';
import { ScreenSizeService } from '@services';

import { SubSink } from 'subsink';

enum CardViews {
  LIST = 0,
  DETAIL = 1
}

@Component({
  selector: 'app-sbas-results-menu',
  templateUrl: './sbas-results-menu.component.html',
  styleUrls: ['./sbas-results-menu.component.scss',  '../results-menu.component.scss']
})
export class SBASResultsMenuComponent implements OnInit, OnDestroy {
  @Input() resize$: Observable<void>;
  public pair: CMRProductPair;

  public view = CardViews.LIST;
  public Views = CardViews;

  public breakpoint: Breakpoints;
  public breakpoints = Breakpoints;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        point => this.breakpoint = point
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getSelectedPair).subscribe(
        (selected: CMRProductPair) => this.pair = selected
      )
    );
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.ToggleFiltersMenu());
  }

  public onSelectList(): void {
    this.view = CardViews.LIST;
  }

  public onSelectDetail(): void {
    this.view = CardViews.DETAIL;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
