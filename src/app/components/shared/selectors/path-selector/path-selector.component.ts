import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subject } from 'rxjs';
import { tap, map, delay } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { Range, Props } from '@models';
import { PropertyService } from '@services';

enum PathFormInputType {
  PATH_START = 'Path Start',
  PATH_END = 'Path End',
  FRAME_START = 'Frame Start',
  FRAME_END = 'Frame End'
}

@Component({
  selector: 'app-path-selector',
  templateUrl: './path-selector.component.html',
  styleUrls: ['./path-selector.component.scss']
})
export class PathSelectorComponent implements OnInit {
  @ViewChild('pathForm', { static: true }) public pathForm: NgForm;

  private inputErrors$ = new Subject<PathFormInputType>();
  private currentError: PathFormInputType | null = null;
  private inputTypes = PathFormInputType;

  public pathStart: number | null;
  public pathEnd: number | null;
  public frameStart: number | null;
  public frameEnd: number | null;

  private get pathStartControl() {
    return this.pathForm.form
      .controls['pathStart'];
  }

  private get pathEndControl() {
    return this.pathForm.form
      .controls['pathEnd'];
  }

  private get frameStartControl() {
    return this.pathForm.form
      .controls['frameStart'];
  }

  private get frameEndControl() {
    return this.pathForm.form
      .controls['frameEnd'];
  }

  public p = Props;
  public shouldOmitSearchPolygon$ = this.store$.select(filtersStore.getShouldOmitSearchPolygon);

  constructor(
    public prop: PropertyService,
    private store$: Store<AppState>
  ) { }

  ngOnInit() {
    this.handlePathFrameErrors();

    this.store$.select(filtersStore.getPathRange).subscribe(
      range => {
        this.pathStart = range.start;
        this.pathEnd = range.end;
      }
    );
    this.store$.select(filtersStore.getFrameRange).subscribe(
      range => {
        this.frameStart = range.start;
        this.frameEnd = range.end;
      }
    );
  }

  public onPathStartChanged(path: string): void {
    if (!this.isValidNumber(path)) {
      this.inputErrors$.next(PathFormInputType.PATH_START);
      this.store$.dispatch(new filtersStore.SetPathStart(null));
    } else {
      this.store$.dispatch(new filtersStore.SetPathStart(+path));
    }
  }

  public onPathEndChanged(path: string): void {
    if (!this.isValidNumber(path)) {
      this.inputErrors$.next(PathFormInputType.PATH_END);
      this.store$.dispatch(new filtersStore.SetPathEnd(null));
    } else {
      this.store$.dispatch(new filtersStore.SetPathEnd(+path));
    }
  }

  public onFrameStartChanged(frame: string): void {
    if (!this.isValidNumber(frame)) {
      this.inputErrors$.next(PathFormInputType.FRAME_START);
      this.store$.dispatch(new filtersStore.SetFrameStart(null));
    } else {
      this.store$.dispatch(new filtersStore.SetFrameStart(+frame));
    }
  }

  public onFrameEndChanged(frame: string): void {
    if (!this.isValidNumber(frame)) {
      this.inputErrors$.next(PathFormInputType.FRAME_END);
      this.store$.dispatch(new filtersStore.SetFrameEnd(null));
    } else {
      this.store$.dispatch(new filtersStore.SetFrameEnd(+frame));
    }
  }

  private isValidNumber(val: string): boolean {
    return !!val && !isNaN(+val) && (+val) >= 0;
  }

  public onNewOmitPolygon(e): void {
    const action = e.checked ?
      new filtersStore.OmitSearchPolygon() :
      new filtersStore.UseSearchPolygon();

    this.store$.dispatch(action);
  }

  private handlePathFrameErrors(): void {
    this.inputErrors$.pipe(
      tap(inputType => this.currentError = inputType),
      map(
        inputType => this.getInput(inputType)
      ),
      tap(control => {
        control.reset();
        control.setErrors({'incorrect': true});
      }),
      delay(820),
    ).subscribe(control => {
      this.currentError = null;
      control.setErrors(null);
    });
  }

  private getInput(inputType: PathFormInputType) {
    return {
      [PathFormInputType.PATH_START]: this.pathStartControl,
      [PathFormInputType.PATH_END]: this.pathEndControl,
      [PathFormInputType.FRAME_START]: this.frameStartControl,
      [PathFormInputType.FRAME_END]: this.frameEndControl,
    }[inputType];
  }

  private typeHasError(inputType: PathFormInputType): boolean {
    return this.currentError === inputType;
  }
}
