const sanitizeHtml = require('sanitize-html');

module.exports = {
  options:
  {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: false,
    allowedIframeHostnames: ['www.youtube.com']
  }
}