import { render } from 'preact'
import Router from 'preact-router'
import './index.css'
import { PageIndex } from './components/PageIndex.tsx'
import { PageAbout } from './components/PageAbout.tsx'
import { PageBoard } from './components/PageBoard.tsx'
import { PageComponents } from './components/PageComponents.tsx'
import { PageDebug } from './components/PageDebug.tsx'
import { createAppState } from './appState.ts'
import { useEffect } from 'preact/hooks'
import { RepositoryLocalStorage } from './repositories/repository.ts'
import { ApplicationService } from './applications/applicationService.ts'

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
  )
}

render(<Main />, document.getElementById('app')!)
