/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "h" }] */
import {h, app} from 'hyperapp'
import './css/index.less'
import logo from './assets/app-logo.png'
import {square} from './util/math'

const state = {
  count: 0
}
const actions = {
  down: value => {
    console.error(square(value))
    return state => ({count: state.count - value})
  },
  up: value => state => ({count: state.count + value})
}

const view = (state, actions) => (
  <div class='body'>
    <h1>{state.count}</h1>
    <button class='button' onclick={() => actions.down(1)}>-</button>
    <button onclick={() => actions.up(1)}>+</button>
    <img src={logo}/>
    <h2>watcher 9</h2>
  </div>
)

app(state, actions, view, document.body)
if (module.hot) {
  module.hot.accept();
}
