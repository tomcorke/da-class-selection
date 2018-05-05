import React from 'react'

import Section from '../section'
import FeedbackMessage from '../feedback-message'

import ViewMenu from '../view-menu'

import IntroView from '../views/intro'
import MainView from '../views/main'
import OverviewView from '../views/overview'
import ExportView from '../views/export'

const MainSection = ({ view }) => {
  console.log(view)

  const View = {
    intro: IntroView,
    main: MainView,
    overview: OverviewView,
    export: ExportView
  }[view]

  return (
    <Section type='main'>

      <ViewMenu />

      <View />

      <FeedbackMessage />

    </Section>
  )
}

export default MainSection
