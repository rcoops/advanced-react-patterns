// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import { Switch } from '../switch'


const ToggleOn = ({ on, children }) => on ? children : null
const ToggleOff = ({ on, children }) => on ? null : children
const ToggleButton = ({ on, toggle, ...props }) => <Switch on={on} onClick={toggle} {...props} />
const childrenNeedingTogglProps = [ToggleOn, ToggleOff, ToggleButton]

function Toggle({ children }) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return React.Children
    .map(children, (child) => childrenNeedingTogglProps.includes(child.type)
      ? React.cloneElement(child, { on, toggle })
      : child
    )
}

function DontWantNoProps ({on}) {
  return (
    <div>
      {on === undefined ? 'Nothing to see here' : 'How did this even happen??'}
    </div>
  )
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <ToggleButton />
        <DontWantNoProps />
        <span>Hello</span>
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
