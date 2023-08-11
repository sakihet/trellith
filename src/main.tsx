import { render } from 'preact'
import Router from 'preact-router'
import { PageIndex } from './components/PageIndex.tsx'
import './index.css'
import { PageBoard } from './components/PageBoard.tsx'
import { PageAbout } from './components/PageAbout.tsx'

const Main = () => (
  <Router>
    <PageIndex path="/" />
    <PageAbout path="/about" />
    <PageBoard path="/board/:board_id" />
  </Router>
)

render(<Main />, document.getElementById('app')!)
