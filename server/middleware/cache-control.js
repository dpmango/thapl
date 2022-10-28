export default defineEventHandler(({ res, req }) => {
  const year = 31536000
  const tenmin = 600
  const url = req.url
  const maxage = url.match(/(.+)\.(jpg|jpeg|gif|css|png|js|ico|svg|mjs)/) ? year : tenmin

  res.setHeader('Cache-Control', `max-age=${maxage} s-maxage=${maxage}`)
})
