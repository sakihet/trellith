import { Link } from "preact-router/match"

type AppLayoutProps = {
  children: any
}

export function AppLayout(props: AppLayoutProps) {
  return (
    <>
      <div class="h-12 p-3 flex-row bg-primary border-0 border-b-1 border-solid border-color-primary">
        <div class="f-1 h-6"></div>
        <div class="w-32 h-6">
          <Link
            href="/"
            class="text-decoration-none h-6"
          >
            <h1 class="m-0 h-6 text-center text-medium text-primary font-weight-600">
              Trellith
            </h1>
          </Link>
        </div>
        <div class="f-1 h-6 text-right">
          <div class="py-05">
            <Link
              href="/about"
              class="text-decoration-none text-secondary text-small"
            >
              About
            </Link>
          </div>
        </div>
      </div>
      <div class="f-1 bg-primary p-6">
        {props.children}
      </div>
      <div class="h-6 text-center text-small p-1 bg-primary border-solid border-0 border-t-1 border-color-primary">
        <Link
          class="text-decoration-none text-secondary"
          href="https://github.com/sakihet/trellith"
        >GitHub</Link>
      </div>
    </>
  )
}
