function showHelp() {
    $('#myModal').modal();
}


function showPopover(element, text,  options) {
    $('.has-popover').popover('hide');
    $('.has-popover').removeClass('has-popover');
    $(element).addClass('has-popover');

    $(element).popover(options);
    $(element).popover('show');
    setTimeout(function() {
              $(element).removeClass('has-popover');
              $(element).popover('hide');
    }, 2000);
}

