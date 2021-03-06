import { Reducer } from "redux";

import {
  APIPlayer,
  APIPlayerData,
  APIPlayerOverviewSelectionsMetaData,
  APIPlayerProfile,
  APIPlayerSelectionsWithLock,
  LockSelectionChoice
} from "../../../types/api";
import { WowClassSafeName, WowSpecSafeName } from "../../../types/classes";
import config from "../../config";
import actions from "../actions/index";
import { UserDataActions } from "../actions/user-data";

export interface UserSelection {
  class?: WowClassSafeName;
  spec?: WowSpecSafeName;
  comments?: string;
  locked?: boolean;
  lockedChoice?: LockSelectionChoice;
}

export interface UserSelections {
  [choice: string]: UserSelection | undefined;
}

export interface UserDataState {
  isGettingUserData?: boolean;
  user?: APIPlayer;
  selections: UserSelections;
  lockData: APIPlayerOverviewSelectionsMetaData;
  profile?: APIPlayerProfile;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasChanges: boolean;
  isLoggedIn: boolean;
  hasProfile: boolean;
  hasCharacters: boolean;
  hasCharactersInGuild: boolean;
  showConfirmSelectionsPrompt: boolean;
}

const filterByGuild = (guild, realm) => char =>
  char.guild === guild && char.realm === realm;

const setGettingData = (
  state: UserDataState,
  isGettingData: boolean
): UserDataState => {
  return {
    ...state,
    isGettingUserData: isGettingData
  };
};

const handleUserData = (
  state: UserDataState,
  userData: APIPlayerData
): UserDataState => {
  const {
    user,
    isAdmin,
    isSuperAdmin,
    selections = {} as APIPlayerSelectionsWithLock,
    lockData
  } = userData;

  let { profile } = userData;
  profile = profile || {};
  profile.characters = profile.characters || [];

  const isLoggedIn = !!user;
  const hasProfile = !!profile;
  const hasCharacters = profile.characters.length > 0;
  const hasCharactersInGuild =
    profile.characters.filter(filterByGuild(config.guild, config.realm))
      .length > 0;

  return {
    ...setGettingData(state, false),
    user,
    selections,
    lockData,
    profile,
    isAdmin,
    isSuperAdmin,
    hasChanges: false,
    isLoggedIn,
    hasProfile,
    hasCharacters,
    hasCharactersInGuild
  };
};

const handleChangeSelection = (
  state: UserDataState,
  { name, property, value }: { name: string; property: string; value: string }
): UserDataState => {
  return {
    ...state,
    selections: {
      ...state.selections,
      [name]: {
        ...state.selections[name],
        [property]: value
      }
    }
  };
};

const showConfirmSelectionsPrompt = (state: UserDataState): UserDataState => ({
  ...state,
  showConfirmSelectionsPrompt: true
});

const hideConfirmSelectionsPrompt = (state: UserDataState): UserDataState => ({
  ...state,
  showConfirmSelectionsPrompt: false
});

const initialState: UserDataState = {
  selections: {},
  lockData: { locked: false, confirmed: false },
  isAdmin: false,
  isSuperAdmin: false,
  hasChanges: false,
  isLoggedIn: false,
  hasProfile: false,
  hasCharacters: false,
  hasCharactersInGuild: false,
  showConfirmSelectionsPrompt: false
};

const UserDataReducer: Reducer<UserDataState, UserDataActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case actions.userData.GET_USER_DATA_START:
      return setGettingData(state, true);
    case actions.userData.GET_USER_DATA_FAIL:
      return setGettingData(state, false);
    case actions.userData.GET_USER_DATA_SUCCESS:
      return setGettingData(state, false);
    case actions.userData.HANDLE_USER_DATA:
      return handleUserData(state, action.payload);
    case actions.userData.CHANGE_SELECTION:
      return handleChangeSelection(state, action.payload);
    case actions.userData.CONFIRM_SELECTIONS_PROMPT_SHOW:
      return showConfirmSelectionsPrompt(state);
    case actions.userData.CONFIRM_SELECTIONS_PROMPT_HIDE:
      return hideConfirmSelectionsPrompt(state);
    default:
      return state;
  }
};

export default UserDataReducer;
