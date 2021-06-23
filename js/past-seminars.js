$(document).ready(() => {
  if ($('#past-seminars').length == 0) {
    return;
  }

  $('#past-seminars li a.nav-link').on('click', ev => {
    $(ev.target).tab('show');
    ev.preventDefault();
    ev.stopPropagation();
  })
})
