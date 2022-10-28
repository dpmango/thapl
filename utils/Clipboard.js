export const copyToClipboard = (textToCopy, focusRef) => {
  // fallback function
  function copyViaGhost() {
    // text area method
    const textArea = document.createElement('textarea')
    textArea.value = textToCopy
    // make the textarea out of viewport
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    return new Promise(function (resolve, reject) {
      document.execCommand('copy') ? resolve() : reject(new Error('error'))
      if (focusRef) selectText(focusRef)
      textArea.remove()
    })
  }

  function selectText(node) {
    if (document.body.createTextRange) {
      const range = document.body.createTextRange()
      range.moveToElementText(node)
      range.select()
    } else if (window.getSelection) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(node)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  // navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    if (focusRef) {
      try {
        selectText(focusRef)
      } catch {}
    }

    return navigator.clipboard.writeText(textToCopy).catch((_err) => {
      return copyViaGhost()
    })
  } else {
    // text area method
    return copyViaGhost()
  }
}
