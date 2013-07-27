showHelp = function() {
    $('#myModal').modal();
}

updateScrollSpy = function() {
    //$('#bs-sidebar').on('activate.bs.scrollspy', function () {


         $('[data-spy="scroll"]').each(function () {
          var $spy = $(this).scrollspy('refresh')
        });

    //});

}