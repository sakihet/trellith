import '../app.css'
import { AppLayout } from './AppLayout'

type PageAboutProps = {
  path: string
}

export function PageAbout(props: PageAboutProps) {
  console.log(props)

  return (
    <AppLayout>
      <div class="layout-center">
        <div>
          <h2>About</h2>
        </div>
        <div>
          <p class="">
            Trellith is a project to make a tiny Trello clone tailored for minimalists.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
