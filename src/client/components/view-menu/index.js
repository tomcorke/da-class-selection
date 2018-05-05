import { connect } from 'react-redux'
import actions from '../../actions'

import ViewMenu from './view-menu'

const ConnectedViewMenu = connect(
  (state) => ({
    view: state.view
  }),
  (dispatch) => ({
    changeView: (newView) => dispatch(actions.views.changeView(newView))
  })
)(ViewMenu)

export default ConnectedViewMenu
