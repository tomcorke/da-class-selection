import * as React from 'react'

import SmallButton from '../small-button'

import * as STYLES from './view-menu.scss'
import { View } from '../../redux/reducers/views'

interface MenuItemProps {
  name: View
  text: string
  admin?: boolean
}

const menuItems: MenuItemProps[] = [
  { name: 'main', text: 'Main' },
  { name: 'overview', text: 'Overview', admin: true },
  { name: 'export', text: 'Export', admin: true }
]

interface ViewMenuProps {
  view: View
  isAdmin: boolean
  changeView: (view: View) => any
}

const ViewMenu = ({ view, isAdmin = false, changeView }: ViewMenuProps) => {
  const menuItemsToDisplay = menuItems
    .filter(item => !item.admin || isAdmin)
    .map(item => (
      <div key={item.name} className={STYLES.item}>
        <SmallButton onClick={() => changeView(item.name)} active={item.name === view}>{item.text}</SmallButton>
      </div>
    ))

  return (
    <div className={STYLES.viewMenu}>
      {menuItemsToDisplay.length > 1 && menuItemsToDisplay}
    </div>
  )
}

export default ViewMenu
