export function AppButton({ text, onClick }: { text: string, onClick: () => void }) {
  return (
    <button
      class="px-2 py-1 border-none text-secondary cursor-pointer"
      type="button"
      onClick={onClick}
    >
      {text}
    </button>
  )
}
