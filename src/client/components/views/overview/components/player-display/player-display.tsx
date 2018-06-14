import * as React from 'react'

import PlayerIdentifier from '../player-identifier'
import PlayerAdminLinks from '../player-admin-links'
import PlayerSelections from '../player-selections'
import SelectionLock from '../selection-lock'

import * as STYLES from './player-display.scss'

interface PlayerDisplayProps {
  battletag: string
  showLockIn: boolean
}

const Action = ({ type, children }) => {
  const classNames = `${STYLES.action} ${STYLES[`action__${type}`]}`
  return <div className={classNames}>{children}</div>
}

const CheckAction = ({ children }) => {
  return (
    <label className={STYLES.checkAction}>
      <input type='checkbox' />
      <div className={STYLES.checkDisplay} />
      Locked in
    </label>
  )
}

const PlayerDisplay = ({ battletag, showLockIn }: PlayerDisplayProps) => {

  let lockInDisplay: JSX.Element | null = null
  if (showLockIn) {
    lockInDisplay = <SelectionLock battletag={battletag} />
  }

  return (
    <div className={STYLES.playerDisplay}>
      <div className={STYLES.info}>
        <PlayerIdentifier battletag={battletag} />
        <PlayerAdminLinks battletag={battletag} />
      </div>
      <div className={STYLES.selections}>
        <PlayerSelections battletag={battletag} />
      </div>
      {lockInDisplay}
    </div>
  )
}

export default PlayerDisplay
