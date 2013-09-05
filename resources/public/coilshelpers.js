function deactivateLeftSidebarItems() {
    $('.left-menu-button').removeClass('active');
}

function showModalPopup() {
    $('#myModal').modal();
}



function showHelp() {
    $('#myModal').modal();
}



function hidePopovers() {
    $('.has-popover').popover('hide');
    $('.has-popover').removeClass('has-popover');
}
function showPopover(element, text,  options) {
    hidePopovers();
    $(element).addClass('has-popover');

    $(element).popover(options);
    $(element).popover('show');
    setTimeout(function() {
              $(element).removeClass('has-popover');
              $(element).popover('hide');
    }, 4000);
}

