import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FilterType, SearchType, ViewType, Banner } from '@models';

import { UIActionType, UIActions } from './ui.action';


export interface UIState {
  isFiltersMenuOpen: boolean;
  isResultsMenuOpen: boolean;
  isAOIOptionsOpen: boolean;
  isBrowseDialogOpen: boolean;
  onlyScenesWithBrowse: boolean;
  uiView: ViewType;
  selectedFilter: FilterType | undefined;
  banners: Banner[];
}

export const initState: UIState = {
  isFiltersMenuOpen: false,
  isResultsMenuOpen: false,
  isAOIOptionsOpen: false,
  isBrowseDialogOpen: false,
  onlyScenesWithBrowse: true,
  uiView: ViewType.MAIN,
  selectedFilter: FilterType.DATASET,
  banners: [],
};


export function uiReducer(state = initState, action: UIActions): UIState {
  switch (action.type) {
    case UIActionType.TOGGLE_AOI_OPTIONS: {
      return {
        ...state,
        isAOIOptionsOpen: !state.isAOIOptionsOpen,
      };
    }

    case UIActionType.CLOSE_AOI_OPTIONS: {
      return {
        ...state,
        isAOIOptionsOpen: false
      };
    }

    case UIActionType.TOGGLE_FILTERS_MENU: {
      return {
        ...state,
        isFiltersMenuOpen: !state.isFiltersMenuOpen,
      };
    }

    case UIActionType.CLOSE_FILTERS_MENU: {
      return {
        ...state,
        isFiltersMenuOpen: false
      };
    }

    case UIActionType.OPEN_FILTERS_MENU: {
      return {
        ...state,
        isFiltersMenuOpen: true
      };
    }

    case UIActionType.TOGGLE_BOTTOM_MENU: {
      return {
        ...state,
        isResultsMenuOpen: !state.isResultsMenuOpen
      };
    }

    case UIActionType.CLOSE_BOTTOM_MENU: {
      return {
        ...state,
        isResultsMenuOpen: false
      };
    }

    case UIActionType.OPEN_BOTTOM_MENU: {
      return {
        ...state,
        isResultsMenuOpen: true
      };
    }

    case UIActionType.SET_SELECTED_FILTER: {
      return {
        ...state,
        selectedFilter: action.payload
      };
    }

    case UIActionType.SET_UI_VIEW: {
      return {
        ...state,
        uiView: action.payload
      };
    }

    case UIActionType.SET_ONLY_SCENES_WITH_BROWSE: {
      return {
        ...state,
        onlyScenesWithBrowse: action.payload
      };
    }

    case UIActionType.SET_IS_BROWSE_DIALOG_OPEN: {
      return {
        ...state,
        isBrowseDialogOpen: action.payload
      };
    }

    case UIActionType.ADD_BANNERS: {
      const banners = [
        ...state.banners, ...action.payload
      ];

      return {
        ...state,
        banners
      };
    }

    case UIActionType.REMOVE_BANNER: {
      const banners = [ ...state.banners ]
        .filter(banner => banner !== action.payload);

      return {
        ...state,
        banners
      };
    }

    default: {
      return state;
    }
  }
}


export const getUIState = createFeatureSelector<UIState>('ui');

export const getSelectedFilter = createSelector(
  getUIState,
  state => state.selectedFilter
);

export const getIsAOIOptionsOpen = createSelector(
  getUIState,
  (state: UIState) => state.isAOIOptionsOpen
);

export const getIsFiltersMenuOpen = createSelector(
  getUIState,
  (state: UIState) => state.isFiltersMenuOpen
);

export const getUiView = createSelector(
  getUIState,
  state => state.uiView
);

export const getIsHidden = createSelector(
  getUIState,
  state => state.uiView === ViewType.MAP_ONLY
);

export const getIsResultsMenuOpen = createSelector(
  getUIState,
  state => state.isResultsMenuOpen
);

export const getIsBrowseDialogOpen = createSelector(
  getUIState,
  state => state.isBrowseDialogOpen
);

export const getOnlyScenesWithBrowse = createSelector(
  getUIState,
  state => state.onlyScenesWithBrowse
);

export const getBanners = createSelector(
  getUIState,
  state => state.banners
);
