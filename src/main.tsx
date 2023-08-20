import { render } from 'preact'
import Router from 'preact-router'
import './index.css'
import { PageIndex } from './components/PageIndex.tsx'
import { PageAbout } from './components/PageAbout.tsx'
import { PageBoard } from './components/PageBoard.tsx'
import { PageComponents } from './components/PageComponents.tsx'
import { PageDebug } from './components/PageDebug.tsx'

const Main = () => (
  <Router>
    <PageIndex path="/" />
    <PageAbout path="/about" />
    <PageBoard path="/board/:board_id" />
    <PageComponents path="/components" />
    <PageDebug path="/debug" />
  </Router>
)

render(<Main />, document.getElementById('app')!)
