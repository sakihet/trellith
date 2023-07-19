import { render } from 'preact'
import Router from 'preact-router'
import { PageIndex } from './components/PageIndex.tsx'
import './index.css'
import { PageBoard } from './components/PageBoard.tsx'

const Main = () => (
  <Router>
    <PageIndex path="/" />
    <PageBoard path="/board/:board_id" />
  </Router>
)

render(<Main />, document.getElementById('app')!)
