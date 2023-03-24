export const createScrollableAnchors = (smoothLinks) => {
  const sections = [] as HTMLElement[]
  const links = [] as { name: string; dom: HTMLElement }[]

  for (let i = 0; i < smoothLinks.length; i++) {
    const link = smoothLinks[i]
    const href = link.getAttribute('href')
    const name = href.substring(2, href.length)
    const section = document.getElementById(name)

    if (section) {
      sections.unshift(section)
      links.push({
        name,
        dom: link,
      })
    }
  }

  return { sections, links }
}
