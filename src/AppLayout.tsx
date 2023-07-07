import { Link } from "preact-router/match"

type AppLayoutProps = {
  children: any
}

export function AppLayout(props: AppLayoutProps) {
  return (
    <div class="p-4">
      <div class="h-12">
        <Link href="/" class="text-decoration-none">
          <h1 class="text-center text-large">DnD Board (WIP)</h1>
        </Link>
      </div>
      <div>{props.children}</div>
    </div>
  )
}
