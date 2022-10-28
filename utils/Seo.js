export const createSeoTags = ({ title, description, keywords, ogImage, ogUrl }) => {
  const returnable = {
    title: '',
    meta: [],
  }

  const metaArr = []

  if (title) {
    returnable.title = title
    metaArr.push({ property: 'og:title', content: title })
  }

  if (description) {
    metaArr.push({
      hid: 'description',
      name: 'description',
      content: description,
    })

    metaArr.push({ property: 'og:description', content: description })
  }

  if (ogImage) {
    metaArr.push({ property: 'og:image', content: `https://thapl.com/og/${ogImage}` })
  }
  if (ogUrl) {
    metaArr.push({ property: 'og:url', content: `https://thapl.com${ogUrl}` })
  }

  returnable.meta = metaArr

  return returnable
}
