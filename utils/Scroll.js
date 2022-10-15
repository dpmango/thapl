export const scrollToElement = (id, page) => {
  if (!page) {
    const element = document.getElementById(id)
    if (!element) return

    const headerOffset = document.querySelector('.header__bottom').offsetHeight + 24
    const targetTop = element.getBoundingClientRect().top + window.pageYOffset - headerOffset

    window.scrollTo({ top: targetTop, behavior: 'smooth' })
  }
}

export const scrollPageToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export const scrollWithSpeed = (to, duration = 500, el) => {
  const element = el || document.documentElement
  const start = element.scrollTop
  const change = to - start
  const startDate = +new Date()
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2
    if (t < 1) {
      return (c / 2) * t * t + b
    }
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  const animateScroll = () => {
    const currentDate = +new Date()
    const currentTime = currentDate - startDate

    element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration), 10)
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll)
    } else {
      element.scrollTop = to
    }
  }
  animateScroll()
}

export const lockBody = () => {
  document.querySelector('body').classList.add('js-locked')

  const div = document.createElement('div')
  div.style.overflowY = 'scroll'
  div.style.width = '50px'
  div.style.height = '50px'
  document.body.append(div)

  const scrollWidth = div.offsetWidth - div.clientWidth

  div.remove()

  document.querySelector('body').style.marginRight = scrollWidth + 'px'
}

export const unlockBody = () => {
  document.querySelector('body').classList.remove('js-locked')
  document.querySelector('body').removeAttribute('style')
}
