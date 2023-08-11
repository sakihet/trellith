import { Link } from "preact-router/match"

type AppLayoutProps = {
  children: any
}

export function AppLayout(props: AppLayoutProps) {
  return (
    <>
      <div class="h-12 p-3 flex-row">
        <div class="f-1"></div>
        <div class="f-1">
          <Link
            href="/"
            class="text-decoration-none"
          >
            <h1 class="m-0 text-center text-large text-secondary font-weight-600">Trellith</h1>
          </Link>
        </div>
        <div class="f-1 text-right">
          <Link
            href="/about"
            class="text-decoration-none m-auto text-secondary"
          >
            About
          </Link>
        </div>
      </div>
      <div class="f-1 bg-secondary p-6">
        {props.children}
      </div>
      <div class="h-6 text-center text-small p-1">
        <Link
          class="text-decoration-none text-secondary"
          href="https://github.com/sakihet/trellith"
        >GitHub</Link>
      </div>
    </>
  )
}
