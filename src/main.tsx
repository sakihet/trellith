import { render } from 'preact'
import { Route } from 'wouter-preact'
import PageIndex from './components/PageIndex.tsx'
import PageAbout from './components/PageAbout.tsx'
import PageBoard from './components/PageBoard.tsx'
import PageComponents from './components/PageComponents.tsx'
import PageDebug from './components/PageDebug.tsx'
import { createAppState } from './appState.ts'
import { useEffect, useState } from 'preact/hooks'
import { RepositoryLocalStorage } from './repositories/repository.ts'
import { ApplicationService } from './applications/applicationService.ts'
import TheNavBar from './components/TheNavBar.tsx'
import TheFooter from './components/TheFooter.tsx'
import './css/token.css'
import './css/reset.css'
import './css/base.css'
import './css/utility.css'
import './css/layout.css'
import './css/pattern.css'
import { applyTheme } from './utils.ts'
import { State } from './types/state.ts'
import PageSandbox from './components/PageSandbox.tsx'
import TheCommandPalette from './components/TheCommandPalette.tsx'
import { signal } from '@preact/signals'

const { appState, appTheme } = createAppState()

export const showCommandPalette = signal(false)

function Main() {
  const repository = new RepositoryLocalStorage()
  const service = new ApplicationService(repository)

  useEffect(() => {
    const result: State = service.load()
    if (result) {
      appState.value = result
    }
    applyTheme(appTheme.value)
  }, [])

  const [pressingModifier, setPressingModifier] = useState<boolean>(false)

  document.onkeydown = (e: KeyboardEvent) => {
    // TODO: support OSs other than Mac
    if (e.key === 'Meta') {
      setPressingModifier(true)
    } else if (e.key === 'k' && pressingModifier) {
      if (showCommandPalette.value) {
        showCommandPalette.value = false
      } else {
        showCommandPalette.value = true
      }
    } else {
      setPressingModifier(false)
    }
  }

  document.onkeyup = (e: KeyboardEvent) => {
    if (e.key === 'Meta') {
      setPressingModifier(false)
    }
  }

  return (
    <>
      <TheNavBar theme={appTheme} />
      <TheCommandPalette appState={appState} />
      <main class="f-1 overflow-y-auto pattern-scrollbar-thick bg-primary">
        <Route path="/">
          <PageIndex
            appState={appState}
          />
        </Route>
        <Route path="/about">
          <PageAbout />
        </Route>
        <Route path="/board/:boardId">
          {params =>
            <PageBoard
              appState={appState}
              boardId={params.boardId}
            />
          }
        </Route>
        <Route path="/board/:boardId/card/:cardId">
          {params =>
            <PageBoard
              appState={appState}
              boardId={params.boardId}
              cardId={params.cardId}
            />
          }
        </Route>
        <Route path="/components">
          <PageComponents />
        </Route>
        <Route path="/debug">
          <PageDebug appState={appState} />
        </Route>
        <Route path="/sandbox">
          <PageSandbox />
        </Route>
      </main>
      <TheFooter />
    </>
  )
}

render(<Main />, document.getElementById('app')!)
