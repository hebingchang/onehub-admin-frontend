module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#222',
          'link-color': '#222',
          'border-radius-base': '2px',
        },
        javascriptEnabled: true
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/admin' : '/'
}