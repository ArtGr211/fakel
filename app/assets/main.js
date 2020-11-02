$(document).ready(function () {
  $('#mobileToggle').on('click', function() {
    $('.sidebar-nav__list').toggleClass('active');
    $(this).toggleClass('active');
  })
})