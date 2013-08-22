function showHelp() {
    $('#myModal').modal();
}


function showPopover(element, text,  options) {
    $(element).popover(options);
    $(element).popover('show');
    setTimeout(function() {
              $(element).popover('hide');
    }, 2000);
}
