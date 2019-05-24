const sanitizeHtml = require('sanitize-html');

module.exports = {
  options:
  {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      iframe: [
        'width', 'height', 'src', 'frameborder', 'allow', 'allowfullscreen'
      ]
    },
    allowedIframeHostnames: ['www.youtube.com']
  }
}