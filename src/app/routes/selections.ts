import * as express from 'express'

import { requireAdmin } from '../middleware/auth'
import { PlayerSelectionChoice, APILockSelectionsPayload, PLAYER_SELECTION_CHOICES, LOCK_SELECTION_CHOICES, APIUnlockSelectionsPayload } from '../../types/api'
import { lockOverviewSelections, unlockOverviewSelections } from '../services/selections'

const selectionsRouter = express.Router()

const isPlayerChoice = (value: any): value is PlayerSelectionChoice => {
  return PLAYER_SELECTION_CHOICES.includes(value)
}

const formatLockSelectionsPayload = (body: any): APILockSelectionsPayload | undefined => {
  if (!body || typeof body !== 'object') {
    return
  }

  if (!body.battletag
    || !body.playerOverviewSelections
    || !LOCK_SELECTION_CHOICES.every(c => !!body.playerOverviewSelections[c])) {
    return
  }

  return {
    battletag: String(body.battletag),
    playerOverviewSelections: LOCK_SELECTION_CHOICES.reduce((poc, c) => ({
      ...poc,
      [c]: String(body.playerOverviewSelections[c])
    }), {})
  }
}

selectionsRouter.post('/lock', requireAdmin, (req, res) => {
  const body = formatLockSelectionsPayload(req.body)
  if (body && lockOverviewSelections(body.battletag, body.playerOverviewSelections)) {
    return res.send('ok')
  }
  res.status(500).send('not ok')
})

const formatUnlockSelectionsPayload = (body: any): APIUnlockSelectionsPayload | undefined => {
  if (!body || typeof body !== 'object') {
    return
  }

  if (!body.battletag) {
    return
  }

  return {
    battletag: String(body.battletag)
  }
}

selectionsRouter.post('/unlock', requireAdmin, (req, res) => {
  const body = formatUnlockSelectionsPayload(req.body)
  if (body && unlockOverviewSelections(body.battletag)) {
    return res.send('ok')
  }
  res.status(500).send('not ok')
})

export default selectionsRouter
