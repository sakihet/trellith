import { render } from 'preact'
import Router from 'preact-router'
import { App } from './app.tsx'
import './index.css'
import { PageBoard } from './PageBoard.tsx'

const Main = () => (
  <Router>
    <App path="/" />
    <PageBoard path="/board/:board_id" />
  </Router>
)

render(<Main />, document.getElementById('app')!)
