export const localStorageKeepArray = (key, data, compareKey?) => {
  try {
    const curItem = localStorageGet(key) || []

    if (typeof data === 'object') {
      if (!curItem.some((x) => x[compareKey] === data[compareKey])) {
        curItem.push(data)
      }
    } else if (!curItem.includes(data)) {
      curItem.push(data)
    }

    localStorage.setItem(key, JSON.stringify(curItem))

    return curItem
  } catch {}
}

export const localStorageGet = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '')
  } catch (error) {
    return null
  }
}
