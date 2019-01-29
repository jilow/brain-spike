module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/brain-spike/dist/'
    : '/'
}