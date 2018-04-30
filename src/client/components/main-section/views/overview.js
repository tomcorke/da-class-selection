import React from 'react'

import ClassIcon from '../../class-icon'
import RoleIcon from '../../role-icon'

import classes from '../../../data/classes'

import STYLES from './overview.scss'

const BattleTag = ({ children, characters }) => {
  const filteredCharacters = characters
    .filter(c => c.guild === 'Distinctly Average' && c.realm === 'Silvermoon')
  const characterList = filteredCharacters.length > 0
    ? filteredCharacters
      .map(c => c.name)
      .join('\n')
    : 'No characters in guild'
  return (
    <div className={STYLES.battletag} title={characterList}>{children}</div>
  )
}

const getClass = (name) => {
  return classes.find(c => c.safeName === name)
}
const getSpec = (wowClass, name) => {
  return wowClass && wowClass.specialisations.find(s => s.safeName === name)
}
const getRoleTag = (spec) => {
  return ['tank', 'healer', 'dps'].find(tag => spec && spec.tags && spec.tags.includes(tag))
}

const WarningIndicator = ({ severity, message }) => {
  const elements = []
  for (let i = 0; i < severity; i++) {
    elements.push(<div className={STYLES.severityIndicator} key={i} />)
  }
  return <div className={STYLES.warningIndicator} data-severity={severity} data-message={message} title={message}>
    {elements}
  </div>
}

const Selection = ({ num, class: wowClass, spec, comments, selected, onClick, warningMessage, warningSeverity }) => {
  const cleanComment = comments && comments.trim()
  const hasComment = cleanComment && cleanComment.length > 0

  return (
    <div className={STYLES.selection} title={cleanComment} data-selected={selected} onClick={onClick}>
      <div className={STYLES.choiceNumber}>
        {num}
      </div>
      <div className={STYLES.class}>
        <ClassIcon wowClass={wowClass.safeName} />
      </div>
      <div className={STYLES.role}>
        <RoleIcon role={getRoleTag(spec)} />
      </div>
      <div className={STYLES.spec}>
        {spec.name}
      </div>
      <div className={STYLES.indicators}>
        {hasComment && <div className={STYLES.commentIndicator} data-comment={cleanComment} />}
        {warningMessage && <WarningIndicator severity={warningSeverity} message={warningMessage} />}
      </div>
    </div>
  )
}

const choiceNumbers = {
  first: 1,
  second: 2,
  third: 3
}

const Selections = ({ characters, selections, onChoiceSelect }) => {
  return (
    <div className={STYLES.selections}>
      {selections.map(choice => {
        const realCharacters = characters.filter(c => c.realm)
        const classCharacters = realCharacters.filter(c => c.class === choice.data.class.safeName)
        const maxLevelCharacters = classCharacters.filter(c => c.level === 110)
        const realmCharacters = maxLevelCharacters.filter(c => c.realm === 'Silvermoon')
        const guildCharacters = realmCharacters.filter(c => c.guild === 'Distinctly Average')

        let warning = null
        let severity = 0
        if (classCharacters.length === 0) {
          warning = 'Player has no characters of this class'
          severity = 3
        } else if (maxLevelCharacters.length === 0) {
          warning = `Player has no characters of this class at max level

Other class characters:
${classCharacters.map(c => `  ${c.level} - ${c.name} (${c.realm})`).join('\n')}`
          severity = 3
        } else if (realmCharacters.length === 0) {
          warning = `Player has no max level characters of this class on Silvermoon

Other class characters:
${classCharacters.map(c => `  ${c.level} - ${c.name} (${c.realm})`).join('\n')}`
          severity = 2
        } else if (guildCharacters.length === 0) {
          warning = `Player has no max level characters of this class in the guild

Other class characters:
${classCharacters.map(c => `  ${c.level} - ${c.name} (${c.realm})`).join('\n')}`
          severity = 1
        }

        return <Selection
          key={choice.choice}
          num={choiceNumbers[choice.choice]}
          {...choice.data}
          selected={choice.selected}
          onClick={() => {
            if (choice.selected) {
              onChoiceSelect(null)
            } else {
              onChoiceSelect(choice.choice)
            }
          }}
          warningMessage={warning}
          warningSeverity={severity} />
      })}
    </div>
  )
}

const UserSelections = ({ data, onChoiceSelect }) => {
  return (
    <div className={STYLES.userSelections}>
      <BattleTag characters={data.characters}>{data.battletag}</BattleTag>
      <Selections characters={data.characters} selections={data.selections} onChoiceSelect={onChoiceSelect} />
    </div>
  )
}

const mapData = (data) => {
  const { userSelectionData, userProfileData } = data
  return Object.entries(userSelectionData).map(([key, value]) => ({
    battletag: key,
    characters: (userProfileData[key] || {}).characters || [],
    selections: Object.entries(value).map(([key, value]) => ({
      choice: key,
      data: {
        class: getClass(value.selected.class),
        spec: getSpec(getClass(value.selected.class), value.selected.spec) || {},
        comments: value.comments
      }
    }))
  }))
}

const sumTags = (data) => {
  const flatTags = data.reduce((allTags, user) => {
    user && user.forEach(tags => allTags.push(tags))
    return allTags
  }, [])
  const uniqueTags = new Set()
  data.forEach(user => user.forEach(tags => tags && tags.forEach(tag => uniqueTags.add(tag))))
  return Array.from(uniqueTags).reduce((tagSums, tag) => {
    tagSums[tag] = flatTags.filter(tags => tags && tags.includes(tag)).length
    return tagSums
  }, {})
}

const getTags = (data) => data.map(user => {
  return user.selections.map(selection => {
    return selection.data && selection.data.spec && selection.data.spec.tags
  })
})

const SUMMARY_TAG_GROUPS = {
  'Roles': ['tank', 'healer', 'dps'],
  'DPS': ['ranged', 'melee'],
  'Armour type': ['cloth', 'leather', 'mail', 'plate']
}

const SummaryRowTag = ({ name, value }) => {
  return (
    <div className={STYLES.summaryRowTag} data-has-value={value > 0}>
      <div className={STYLES.summaryRowTagName}>{name}</div>
      <div className={STYLES.summaryRowTagValue}>{value}</div>
    </div>
  )
}

const SummaryRow = ({ title, tags }) => {
  return (
    <div className={STYLES.summaryRow}>
      <div className={STYLES.summaryRowTitle}>
        {title}
      </div>
      <div className={STYLES.summaryRowTags}>
        {tags.map(t => <SummaryRowTag key={t.name} name={t.name} value={t.count} />)}
      </div>
    </div>
  )
}

const Summary = ({ title, tags }) => {
  return (
    <div className={STYLES.summary}>
      <div className={STYLES.summaryTitle}>{title}</div>
      {Object.entries(SUMMARY_TAG_GROUPS).map(([title, groupTags]) => {
        return <SummaryRow
          key={title}
          title={title}
          tags={groupTags.map(t => ({ name: t, count: tags[t] || 0 }))} />
      })}
    </div>
  )
}

class OverviewView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      overviewData: mapData(props.viewData.overview)
    }
    console.log(this.state.overviewData)
    this.selectChoice = this.selectChoice.bind(this)
  }

  selectChoice (battletag, choice) {
    const clonedData = JSON.parse(JSON.stringify(this.state.overviewData))

    clonedData.forEach(user => {
      if (user.battletag === battletag) {
        user.selections.forEach(selection => {
          if (selection.choice === choice) {
            selection.selected = true
          } else {
            selection.selected = false
          }
        })
      }
    })

    this.setState({
      overviewData: clonedData
    })
  }

  render () {
    const { overviewData } = this.state

    const selections = overviewData.map(data => {
      return <UserSelections
        key={data.battletag}
        {...{ data }}
        onChoiceSelect={(choice) => this.selectChoice(data.battletag, choice)} />
    })

    const tagData = getTags(overviewData)

    const selectedChoices = overviewData.map(user => ({
      battletag: user.battletag,
      selections: user.selections.filter(selection => selection.selected)
    }))

    const selectedTagData = getTags(selectedChoices)

    const summedTags = sumTags(tagData)
    const summedSelectedTags = sumTags(selectedTagData)

    const summary = <Summary title='Total summary' tags={summedTags} />
    const selectedSummary = <Summary title='Selected summary' tags={summedSelectedTags} />

    return <div className={STYLES.overview}>

      <div className={STYLES.summaryContainer}>
        {summary}
        {selectedSummary}
      </div>

      <div className={STYLES.selectionsContainer}>
        <div className={STYLES.selectionsHeader}>Selections</div>
        <div className={STYLES.selectionsBlurb}>Click on a user's chosen class to select it and update the summary above</div>
        {selections}
      </div>

    </div>
  }
}

export default OverviewView
