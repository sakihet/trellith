import '../app.css'
import { AppLayout } from './AppLayout'

type PageDebugProps = {
  path: string
}

export function PageDebug(props: PageDebugProps) {
  console.log(props)

  return (
    <AppLayout>
      <div class="layout-center">
        <div>
          <h2>Debug</h2>
        </div>
        <div class="layout-stack-4">
          <div>
            <button>Clear</button>
          </div>
          <div>
            <button>Create sample data</button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
