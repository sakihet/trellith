export default function PageAbout() {
  return (
    <div class="px-4">
      <div class="layout-center">
        <div class="h-12 py-4">
          <h2 class="">About</h2>
        </div>
        <div class="py-4">
          <p>
            Trellith is an open source, tiny Trello clone PWA build with Preact and TypeScript, not storing data in cloud storage. You can start using it by just opening the URL. There is no need to create any accounts. Data is only stored in your browser's localStorage.
          </p>
        </div>
        <div class="py-4">
          <p>
            Please refer to the GitHub <a class="text-link" href="https://github.com/sakihet/trellith">README</a> for more details.
          </p>
        </div>
        <div class="py-4">
          <h3>Discraimer</h3>
        </div>
        <div class="py-4">
          <p>
            Since data is stored in localStorage, the main thread gets blocked, and there is a 5MB size limit.
          </p>
        </div>
        <div class="py-4">
          <h3>Features</h3>
        </div>
        <div class="py-4">
          <p>
            Trellith includes the core features of Trello:
          </p>
          <ul class="py-2 pl-8">
            <li>Create boards</li>
            <li>Create lists</li>
            <li>Create cards</li>
            <li>Rename items</li>
            <li>Sort items by Drag and Drop</li>
          </ul>
          <p>Additional features:</p>
          <ul class="py-2 pl-8">
            <li>
              Light Mode / Dark Mode
            </li>
            <li>
              Import / Export
            </li>
            <li>
              Work offline
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
