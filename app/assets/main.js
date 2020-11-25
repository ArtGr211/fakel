$(document).ready(function () {
  $('#mobileToggle').on('click', function() {
    $('.sidebar-nav__list').toggleClass('active');
    $(this).toggleClass('active');
  });
});

$('.text-editor').each(function() {
  var $input = $(this).find('.text-editor__input');
  var $wysiwyg = $(this).find('.text-editor__wysiwyg');
  var initialContent = $wysiwyg.html();

  $wysiwyg.trumbowyg();
  $wysiwyg.trumbowyg('html', initialContent);

  $wysiwyg.on('tbwchange', function() {
    var content = $wysiwyg.trumbowyg('html');
    $input.val(content);
  });
});
