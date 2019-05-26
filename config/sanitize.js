const sanitizeHtml = require('sanitize-html');

module.exports = {
  options:
  {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: Object.assign(
      {},
      sanitizeHtml.defaults.allowedAttributes,
      {
        iframe: [
          'width', 'height', 'src', 'frameborder', 'allow', 'allowfullscreen'
        ]
      }
    ),
    allowedIframeHostnames: ['www.youtube.com']
  }
}