import '../app.css'

type PageAboutProps = {
  path: string
}

export function PageAbout(props: PageAboutProps) {
  console.log(props)

  return (
    <div class="px-4">
      <div class="layout-center">
        <div class="h-12 py-3">
          <h2 class="m-0 text-medium">About</h2>
        </div>
        <p class="text-medium">
          Trellith is a tiny Trello clone PWA build with Preact and TypeScript, not storing data in cloud storage. You can start using it by just opening the URL. There is no need to create any accounts. Data is only stored in your browser's localStorage.
        </p>
        <h3 class="">Motivation</h3>
        <p class="text-medium">
          This is a project aimed at improving frontend and web design skills while creating a practical product.
        </p>
        <h3 class="">Discraimer</h3>
        <p class="text-medium">
          Since data is stored in localStorage, the main thread gets blocked, and there is a 5MB size limit.
        </p>
        <h3 class="">Features</h3>
        <p class="text-medium">
          Trellith includes the core features of Trello:
          <ul>
            <li>Create boards</li>
            <li>Create lists</li>
            <li>Create cards</li>
            <li>Rename items</li>
            <li>Sort items by Drag and Drop</li>
          </ul>
        </p>
        <h3>Contributing</h3>
        <p class="text-medium">
          If you find any bugs or have feature requests, please create an issue and let me know.
        </p>
      </div>
    </div>
  )
}
