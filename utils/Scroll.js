export const scrollToElement = (id, page) => {
  if (!page) {
    const element = document.getElementById(id)
    if (!element) return

    const headerOffset = document.querySelector('.header__bottom').offsetHeight + 24
    const targetTop = element.getBoundingClientRect().top + window.pageYOffset - headerOffset

    window.scrollTo({ top: targetTop, behavior: 'smooth' })
  }
}
