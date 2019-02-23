$(document).ready(function () {
  // Quill
  $('.quill-editor').each(function () {
    const editorEl = $(this);
    const textarea = editorEl.next('textarea');

    const editor = new Quill(this, {
      modules: {
        toolbar: [
          [
            'bold',
            'italic',
            'underline',
            'link',
            'list',
            'image',
            // 'video',
            'blockquote',
            'code-block'
          ]
        ]
      }
    });

    textarea.css({
      display: 'none'
    })

    editor.on('text-change', function() {
      textarea.val(
        editorEl.find('.ql-editor').html()
      );
    })
  })

  $('#mobileToggle').on('click', function() {
    $('.sidebar-nav__list').toggleClass('active');
    $(this).toggleClass('active');
  })
})