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
          <p class="text-medium">
            Trellith is an open source, tiny Trello clone PWA tailored for minimalists. You can start using it by opening the URL. There is no need to create any account. Data is only stored in your browser's localStorage.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
