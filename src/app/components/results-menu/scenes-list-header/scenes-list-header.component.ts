import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';
import * as searchStore from '@store/search';
import * as filtersStore from '@store/filters';

import {
  MapService, ScenesService, ScreenSizeService,
  PairService
} from '@services';
import * as models from '@models';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-scenes-list-header',
  templateUrl: './scenes-list-header.component.html',
  styleUrls: ['./scenes-list-header.component.scss']
})
export class ScenesListHeaderComponent implements OnInit {
  public totalResultCount$ = this.store$.select(searchStore.getTotalResultCount);
  public numberOfScenes$ = this.store$.select(scenesStore.getNumberOfScenes);
  public numberOfProducts$ = this.store$.select(scenesStore.getNumberOfProducts);
  public allProducts$ = this.scenesService.products$();
  public numBaselineScenes$ = this.scenesService.scenes$().pipe(
    map(scenes => scenes.length),
  );
  public numPairs$ = this.pairService.pairs$().pipe(
    map(pairs => pairs.pairs.length + pairs.custom.length)
  );
  public pairs: models.CMRProductPair[];
  public sbasProducts: models.CMRProduct[];
  public canHideRawData: boolean;
  public showS1RawData: boolean;

  public canHideExpiredData: boolean;
  public showExpiredData: boolean;

  public temporalSort: models.ColumnSortDirection;
  public perpendicularSort: models.ColumnSortDirection;
  public SortDirection = models.ColumnSortDirection;

  public searchType: models.SearchType;
  public SearchTypes = models.SearchType;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private scenesService: ScenesService,
    private pairService: PairService,
    private screenSize: ScreenSizeService,
  ) { }

  ngOnInit() {
    this.subs.add(
       this.pairService.productsFromPairs$().subscribe(
         products => this.sbasProducts = products
       )
    );

    this.subs.add(
      this.pairService.pairs$().subscribe(
        ({pairs, custom}) => this.pairs = [ ...pairs, ...custom ]
      )
    );

    this.subs.add(
      combineLatest(
        this.scenesService.scenes$(),
        this.store$.select(filtersStore.getProductTypes),
        this.store$.select(searchStore.getSearchType),
      ).subscribe(([scenes, productTypes, searchType]) => {
        this.canHideRawData =
          searchType === models.SearchType.DATASET &&
          scenes.every(scene => scene.dataset === 'Sentinel-1B' || scene.dataset === 'Sentinel-1A') &&
          productTypes.length <= 0;
      })
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.canHideExpiredData = searchType === models.SearchType.CUSTOM_PRODUCTS
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getTemporalSortDirection).subscribe(
        temporalSort => this.temporalSort = temporalSort
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getPerpendicularSortDirection).subscribe(
        perpSort => this.perpendicularSort = perpSort
      )
    );

    this.subs.add(
      this.store$.select(uiStore.getShowS1RawData).subscribe(
        showS1RawData => this.showS1RawData = showS1RawData
      )
    );

    this.subs.add(
      this.store$.select(uiStore.getShowExpiredData).subscribe(
        showExpiredData => this.showExpiredData = showExpiredData
      )
    );
  }

  public onZoomToResults(): void {
    this.mapService.zoomToResults();
  }

  public onToggleS1RawData(): void {
    this.store$.dispatch(
      this.showS1RawData ?
        new uiStore.HideS1RawData() :
        new uiStore.ShowS1RawData()
    );
  }

  public onToggleExpiredData(): void {
    this.store$.dispatch(
      this.showExpiredData ?
        new uiStore.HideExpiredData() :
        new uiStore.ShowExpiredData()
    );
  }

  public onTogglePerpendicularSort(): void {
    let direction: models.ColumnSortDirection;

    if (this.perpendicularSort === models.ColumnSortDirection.NONE) {
      direction = models.ColumnSortDirection.INCREASING;
    } else if (this.perpendicularSort === models.ColumnSortDirection.INCREASING) {
      direction = models.ColumnSortDirection.DECREASING;
    } else if (this.perpendicularSort === models.ColumnSortDirection.DECREASING) {
      direction = models.ColumnSortDirection.INCREASING;
    }

    this.store$.dispatch(new scenesStore.SetTemporalSortDirection(models.ColumnSortDirection.NONE));
    this.store$.dispatch(new scenesStore.SetPerpendicularSortDirection(direction));
  }

  public onToggleTemporalSort(): void {
    let direction: models.ColumnSortDirection;

    if (this.temporalSort === models.ColumnSortDirection.NONE) {
      direction = models.ColumnSortDirection.INCREASING;
    } else if (this.temporalSort === models.ColumnSortDirection.INCREASING) {
      direction = models.ColumnSortDirection.DECREASING;
    } else if (this.temporalSort === models.ColumnSortDirection.DECREASING) {
      direction = models.ColumnSortDirection.INCREASING;
    }

    this.store$.dispatch(new scenesStore.SetPerpendicularSortDirection(models.ColumnSortDirection.NONE));
    this.store$.dispatch(new scenesStore.SetTemporalSortDirection(direction));
  }

  public queueAllProducts(products: models.CMRProduct[]): void {
    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public queueSBASProducts(products: models.CMRProduct[]): void {
    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public onDownloadPairCSV() {
    const pairRows = this.pairs
      .map(([reference, secondary]) =>
        `${reference.name},${reference.downloadUrl},${secondary.name},${secondary.downloadUrl}`
      )
      .join('\n');

    const pairsCSV = `Reference, Reference URL, Secondary, Secondary URL,\n${pairRows}`;

    const blob = new Blob([pairsCSV], {
      type: 'text/csv;charset=utf-8;',
    });
    saveAs(blob, 'asf-sbas-pairs.csv');
  }

  public formatNumber(num: number): string {
    return (num || 0)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
