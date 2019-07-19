import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FilterType, SearchType, ViewType, Banner } from '@models';

import { UIActionType, UIActions } from './ui.action';


export interface UIState {
  isSidebarOpen: boolean;
  isFiltersMenuOpen: boolean;
  isBottomMenuOpen: boolean;
  uiView: ViewType;
  selectedFilter: FilterType | undefined;
  searchType: SearchType | null;
  banners: Banner[];
}

export const initState: UIState = {
  isSidebarOpen: false,
  isFiltersMenuOpen: false,
  isBottomMenuOpen: false,
  uiView: ViewType.MAIN,
  selectedFilter: FilterType.DATASET,
  searchType: SearchType.DATASET,
  banners: [],
};


export function uiReducer(state = initState, action: UIActions): UIState {
  switch (action.type) {
    case UIActionType.TOGGLE_SIDEBAR: {
      return {
          ...state,
          isSidebarOpen: !state.isSidebarOpen,
        };
    }

    case UIActionType.CLOSE_SIDEBAR: {
      return {
          ...state,
          isSidebarOpen: false
        };
    }

    case UIActionType.OPEN_SIDEBAR: {
      return {
          ...state,
          isSidebarOpen: true
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
          isBottomMenuOpen: !state.isBottomMenuOpen
        };
    }

    case UIActionType.CLOSE_BOTTOM_MENU: {
      return {
          ...state,
          isBottomMenuOpen: false
        };
    }

    case UIActionType.OPEN_BOTTOM_MENU: {
      return {
          ...state,
          isBottomMenuOpen: true
      };
    }

    case UIActionType.SET_SELECTED_FILTER: {
      return {
          ...state,
          selectedFilter: action.payload
        };
    }

    case UIActionType.SET_SEARCH_TYPE: {
      return {
          ...state,
          searchType: action.payload,
          isSidebarOpen: false
        };
    }

    case UIActionType.SET_UI_VIEW: {
      return {
          ...state,
          uiView: action.payload
        };
    }

    case UIActionType.SET_BANNERS: {
      return {
        ...state,
        banners: action.payload
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

export const getSearchType = createSelector(
  getUIState,
  state => state.searchType
);

export const getIsSidebarOpen = createSelector(
  getUIState,
  state => state.isSidebarOpen
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

export const getIsBottomMenuOpen = createSelector(
  getUIState,
  state => state.isBottomMenuOpen
);

export const getBanners = createSelector(
  getUIState,
  state => state.banners
);
