// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import warning from 'warning';

import {Switch} from '../switch'

const callAll = (...fns) => (...args) => fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useControlledSwitchWarning(isControlled) {
  const {current: onWasControlled} = React.useRef(isControlled)

  React.useEffect(() => {
    warning(
      !(isControlled && !onWasControlled),
      '`useToggle` is changing from uncontrolled to be controlled. Components should not switch '
      + 'from uncontrolled to controlled (or vice versa). Decide between using a controlled or '
      + 'uncontrolled `useToggle` for the lifetime of the component. Check the `on` prop.',
    )
    warning(
      !(!isControlled && onWasControlled),
      '`useToggle` is changing from controlled to be uncontrolled. Components should not switch '
      + 'from controlled to uncontrolled (or vice versa). Decide between using a controlled or '
      + 'uncontrolled `useToggle` for the lifetime of the component. Check the `on` prop.',
    )
  }, [isControlled, onWasControlled]);
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  onChange = null,
  on: controlledOn = null,
  readOnly = false,
} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const onIsControlled = controlledOn !== null;
  const on = onIsControlled ? controlledOn : state.on;
  const isUnintentionallyImmutable = onIsControlled && onChange === null && !readOnly;

  useControlledSwitchWarning(onIsControlled);
  React.useEffect(() => {
    warning(
      !isUnintentionallyImmutable,
      'Failed prop type: You provided a `on` prop to a Toggle without an `onChange` handler. '
      + 'This will render a read-only field. If the field should be mutable use `initialOn`. '
      + 'Otherwise, set either `onChange` or `readOnly`.'
    )
  }, [isUnintentionallyImmutable]);

  function dispatchWithOnChange(action) {
    if (!onIsControlled) {
      dispatch(action)
    }
    onChange?.(reducer({...state, on}, action), action)
  }

  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () => dispatchWithOnChange({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange, readOnly}) {
  const {on, getTogglerProps} = useToggle({on: controlledOn, onChange, readOnly})
  const props = getTogglerProps({on})
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [x, setX] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        <Toggle on={x ? undefined : bothOn} onChange={handleToggleChange}/>
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          on={x}
          onChange={() => setX(!x)}
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
