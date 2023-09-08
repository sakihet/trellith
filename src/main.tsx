import { render } from 'preact'
import Router from 'preact-router'
import { PageIndex } from './components/PageIndex.tsx'
import { PageAbout } from './components/PageAbout.tsx'
import { PageBoard } from './components/PageBoard.tsx'
import { PageComponents } from './components/PageComponents.tsx'
import { PageDebug } from './components/PageDebug.tsx'
import { createAppState } from './appState.ts'
import { useEffect } from 'preact/hooks'
import { RepositoryLocalStorage } from './repositories/repository.ts'
import { ApplicationService } from './applications/applicationService.ts'
import { TheNavBar } from './components/TheNavBar.tsx'
import { TheFooter } from './components/TheFooter.tsx'
import './css/token.css'
import './css/reset.css'
import './css/base.css'
import './css/utility.css'
import './css/layout.css'
import './css/pattern.css'

const {appState} = createAppState()

function Main() {
  const repository = new RepositoryLocalStorage()
  const service = new ApplicationService(repository)

  useEffect(() => {
    const result = service.load()
    if (result) {
      appState.value = result
    }
  }, [])

  return (
    <>
      <TheNavBar />
      <div class="f-1 overflow-y-auto">
        <Router>
          <PageIndex
            path="/"
            appState={appState}
          />
          <PageAbout
            path="/about"
          />
          <PageBoard
            path="/board/:board_id"
            appState={appState}
          />
          <PageComponents
            path="/components"
          />
          <PageDebug
            path="/debug"
          />
        </Router>
      </div>
      <TheFooter />
    </>
  )
}

render(<Main />, document.getElementById('app')!)
