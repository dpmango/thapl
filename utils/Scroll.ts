export const scrollToElement = (
  selector: HTMLElement | Element | string,
  headerTarget: any = true
) => {
  if (!selector) return

  let element
  if (typeof selector === 'string') {
    element = document.getElementById(selector)
  } else if (typeof selector === 'object') {
    element = selector
  }

  if (!element) return

  let headerOffset = 0
  if (headerTarget === true) {
    // применяется для десктопа (прокрутка относительно sticky меню)
    const headerDom = document.querySelector('.header__bottom') as HTMLElement
    headerOffset = (headerDom?.offsetHeight || 0) + 24
  } else if (typeof headerTarget === 'string') {
    // применяется с указанием селектора элемента шапки (или люббого другого элемента)
    const elementDom = document.querySelector(headerTarget) as HTMLElement
    headerOffset = elementDom.offsetHeight + 24
  } else if (typeof headerTarget === 'number') {
    // либо указать оффсет числом
    headerOffset = headerTarget
  }

  const targetTop = element.getBoundingClientRect().top + window.pageYOffset - headerOffset

  // window.scrollTo({ top: targetTop, behavior: 'smooth' })
  scrollWithSpeed(targetTop, 300)
}

export const scrollPageToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export const scrollWithSpeed = (to: number, duration = 500, el?: any) => {
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
  document.querySelector('body')?.classList.add('js-locked')

  const div = document.createElement('div')
  div.style.overflowY = 'scroll'
  div.style.width = '50px'
  div.style.height = '50px'
  document.body.append(div)

  const scrollWidth = div.offsetWidth - div.clientWidth

  div.remove()

  const body = document.querySelector('body') as HTMLElement
  body.style.marginRight = scrollWidth + 'px'
}

export const unlockBody = () => {
  document.querySelector('body')?.classList.remove('js-locked')
  document.querySelector('body')?.removeAttribute('style')
}
