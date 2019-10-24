import { Action } from '@ngrx/store';

import { CMRProduct, SearchType } from '@models';

export enum SearchActionType {
  MAKE_SEARCH = '[Search] Make A Search',
  SEARCH_RESPONSE = '[Search] Search Response',
  SEARCH_ERROR = '[Search] Search Error',
  CANCEL_SEARCH = '[Search] Cancel Search',
  SEARCH_CANCELED = '[Search] Search Canceled',

  CLEAR_SEARCH = '[Search] Clear Search',

  ENABLE_SEARCH = '[Search] Enable Search',
  DISABLE_SEARCH = '[Search] Disable Search',

  SET_SEARCH_AMOUNT = '[Search] Set Search Results Amount',
  SEARCH_AMOUNT_LOADING = '[Search] Search Amount Is Loading',
  SET_SEARCH_TYPE = '[UI] Set Search Type',
}

export class MakeSearch implements Action {
  public readonly type = SearchActionType.MAKE_SEARCH;
}

export class CancelSearch implements Action {
  public readonly type = SearchActionType.CANCEL_SEARCH;
}

export class ClearSearch implements Action {
  public readonly type = SearchActionType.CLEAR_SEARCH;
}

export class SearchCanceled implements Action {
  public readonly type = SearchActionType.SEARCH_CANCELED;
}

export class EnableSearch implements Action {
  public readonly type = SearchActionType.ENABLE_SEARCH;
}

export class DisableSearch implements Action {
  public readonly type = SearchActionType.DISABLE_SEARCH;
}

export class SearchAmountLoading implements Action {
  public readonly type = SearchActionType.SEARCH_AMOUNT_LOADING;
}

export class SetSearchAmount implements Action {
  public readonly type = SearchActionType.SET_SEARCH_AMOUNT;

  constructor(public payload: number) {}
}

export class SearchResponse implements Action {
  public readonly type = SearchActionType.SEARCH_RESPONSE;

  constructor(public payload: {files: CMRProduct[], totalCount: number}) {}
}

export class SearchError implements Action {
  public readonly type = SearchActionType.SEARCH_ERROR;

  constructor(public payload: string) {}
}

export class SetSearchType implements Action {
  public readonly type = SearchActionType.SET_SEARCH_TYPE;

  constructor(public payload: SearchType) {}
}


export type SearchActions =
  | MakeSearch
  | SetSearchAmount
  | CancelSearch
  | ClearSearch
  | EnableSearch
  | DisableSearch
  | SearchAmountLoading
  | SearchError
  | SearchResponse
  | SetSearchType;
