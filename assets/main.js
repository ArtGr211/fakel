$(document).ready(function () {
  $('.quill-editor').each(function () {
    new Quill(this, {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline']
        ]
      }
    });
  })
})