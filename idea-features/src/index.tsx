/* @refresh reload */
import { render } from 'solid-js/web'
import 'uno.css'
import './theme.css'
import './style.css'
import App from './App'

const root = document.getElementById('root')
if (root) {
  render(() => <App />, root)
}
