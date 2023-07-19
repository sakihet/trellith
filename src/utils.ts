export const LOCAL_STORAGE_KEY = 'dnd-board'

export const save = (obj: {}) => {
  console.log('save')
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(obj))
}

export const load = () => {
  console.log('load')
  const value = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (value) {
    return JSON.parse(value)
  } else {
    return { boards: [] }
  }
}
