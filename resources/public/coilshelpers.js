function deactivateLeftSidebarItems() {
    $('.left-menu-button').removeClass('active');
}

function showModalPopup() {
    $('#myModal').modal();
}

function hideModalPopup() {
    $('#myModal').modal('hide');
}



function showHelp() {
    $('#myModal').modal();
}



function hidePopovers() {
    $('.has-popover').popover('hide');
    $('.has-popover').removeClass('has-popover');
}


function showPopover(element,  options) {
    hidePopovers();
    $(element).addClass('has-popover');

    $(element).popover(options);
    $(element).popover('show');
    setTimeout(function() {
              $(element).removeClass('has-popover');
              $(element).popover('destroy');
    }, 4000);
}

function resizeSystem() {
<<<<<<< HEAD
  webapp.client.main.resizeScreenFn($( window ).width(),  $( window ).height());
=======
  if (webapp) {
    if (webapp.client) {
      if (webapp.client.main) {
        webapp.client.main.resizeScreenFn($( window ).width(),  $( window ).height());
      };
    };
  };
>>>>>>> 28f13873494cf33193ae99b2e8553ce47e7e058c
};

$( window ).resize(function() {
  console.log( "RESIZE: (" + $( window ).width() + ", "+ $( window ).height() + ")");
  resizeSystem( );
});
