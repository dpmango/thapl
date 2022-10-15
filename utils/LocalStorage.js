export const localStorageKeepArray = (key, data) => {
  try {
    const curItem = localStorageGet(key) || []

    if (!curItem.includes(data)) {
      curItem.push(data)
    }

    localStorage.setItem(key, JSON.stringify(curItem))
  } catch {}
}

export const localStorageGet = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (error) {
    return null
  }
}
