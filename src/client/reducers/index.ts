import { combineReducers, Reducer } from 'redux'

import ConfigReducer, { ConfigState } from './config'
import FeedbackReducer, { FeedbackState } from './feedback'
import LoginReducer, { LoginState } from './login'
import OverviewReducer, { OverviewState } from './overview'
import OverviewSelectionsReducer, { OverviewSelectionsState } from './overview-selections'
import OverviewSettingsReducer, { OverviewSettingsState } from './overview-settings'
import UserDataReducer, { UserDataState } from './user-data'
import ViewReducer, { ViewState } from './views'

export type ApplicationState = {
  config: ConfigState
  feedback: FeedbackState
  login: LoginState
  overview: OverviewState
  overviewSelections: OverviewSelectionsState
  overviewSettings: OverviewSettingsState
  userData: UserDataState
  view: ViewState
}

const rootReducer: Reducer<ApplicationState> = combineReducers<ApplicationState>({
  config: ConfigReducer,
  feedback: FeedbackReducer,
  login: LoginReducer,
  overview: OverviewReducer,
  overviewSelections: OverviewSelectionsReducer,
  overviewSettings: OverviewSettingsReducer,
  userData: UserDataReducer,
  view: ViewReducer
})

export default rootReducer