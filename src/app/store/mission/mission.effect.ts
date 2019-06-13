import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { Observable, combineLatest } from 'rxjs';
import { map, withLatestFrom, startWith, switchMap, tap, filter } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { MissionActionType, SetMissions } from './mission.action';

import { AsfApiService } from '@services/asf-api.service';
import * as models from '@models';

@Injectable()
export class MissionEffects {
  constructor(
    private actions$: Actions,
    private asfApiService: AsfApiService,
  ) {}

  @Effect()
  private loadMissions: Observable<SetMissions> = this.actions$.pipe(
    ofType(MissionActionType.LOAD_MISSIONS),
    switchMap(action => combineLatest(
      this.asfApiService.missionSearch(models.MissionDataset.S1_BETA).pipe(
        map(resp => ({[models.MissionDataset.S1_BETA]: resp.result}))
      ),
      this.asfApiService.missionSearch(models.MissionDataset.AIRSAR).pipe(
        map(resp => ({[models.MissionDataset.AIRSAR]: resp.result}))
      ),
      this.asfApiService.missionSearch(models.MissionDataset.UAVSAR).pipe(
        map(resp => ({[models.MissionDataset.UAVSAR]: resp.result}))
      )
    ).pipe(
      map(missions => missions.reduce(
        (allMissions, mission) => ({ ...allMissions, ...mission }),
        {}
      )),
      map(missionsByDataset => new SetMissions(missionsByDataset))
    )
    )
  );
}
