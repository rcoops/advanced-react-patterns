// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {Switch} from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return {
    on,
    toggle,
    getToggleProps: ({ onClick, ...props } = {}) => ({'aria-pressed': on, onClick: callAll(onClick, toggle), ...props})
  }
}

function App() {
  const {on, getToggleProps} = useToggle()
  return (
    <div>
      <Switch {...getToggleProps({on})} />
      <hr />
      <button
        {...getToggleProps({
          'aria-label': 'custom-button',
          onClick: () => console.info('onButtonClick'),
          id: 'custom-button-id',
        })}
      >
        {on ? 'on' : 'off'}
      </button>
    </div>
  )
}



export default App
