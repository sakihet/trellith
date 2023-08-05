import { Link } from "preact-router/match"

type AppLayoutProps = {
  children: any
}

export function AppLayout(props: AppLayoutProps) {
  return (
    <>
      <div class="h-12 p-3">
        <Link href="/" class="text-decoration-none">
          <h1 class="m-0 text-center text-large">Trellith (WIP)</h1>
        </Link>
      </div>
      <div class="f-1 bg-secondary p-4">
        {props.children}
      </div>
      <div class="h-6"></div>
    </>
  )
}
