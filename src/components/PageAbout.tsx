export default function PageAbout() {
  return (
    <div class="px-4">
      <div class="layout-center">
        <div class="py-4 layout-stack-4">
          <h2>About</h2>
          <p>
            Trellith is a tiny Trello clone PWA pursuing simplicity. It's a task management tool with a board view format, designed for individuals.
          </p>
          <img
            class="border-solid border-1 border-color-primary"
            width="400"
            src="./trellith-with-frame.png"
          />
          <h3>How to use</h3>
          <p>
            You can start using it by just opening the URL. There is no need to create any accounts. Data is only stored in your browser's localStorage.
          </p>
          <p>
            Trellith is designed with minimal server maintenance costs. It allows users to use this for free within the browser's storage limit.
          </p>
          <p>
            Please refer to the GitHub <a class="text-link" href="https://github.com/sakihet/trellith">README</a> for more details.
          </p>
          <h3>What you get with Trellith</h3>
          <h4>✅ Features as a task management app</h4>
          <p>
            You can organize your projects into boards like a kanban using lists and cards.
          </p>
          <h4>⛺️ Work offline</h4>
          <p>
            Trellith works offline once you open the app.
          </p>
          <h4>🛡 Data ownership</h4>
          <p>
            Trellith respects your ownership of the data you make. Data is stored on your browser's storage. You can export them if you want.
          </p>
          <h3>Discraimer</h3>
          <p>
            Since the data is stored in localStorage, the main thread gets blocked, and there is a 5MB size limit in general.
          </p>
          <h3>Feedback</h3>
          <p>
            Trellith is open source. It's developed on <a class="text-link" href="https://github.com/sakihet/trellith" >GitHub</a>
          </p>
        </div>
      </div>
    </div>
  )
}
