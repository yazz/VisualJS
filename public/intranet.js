    var call_on_click = function(addr) {
        alert(addr);
    };
        setInterval(
            function() {
                $.ajax({
                    type: "GET",
                    url: '/get_intranet_servers',
                    success: function(data) {
                        //alert(JSON.stringify(data,null,2));
                        $("#local_machine_in_intranet").html(eval( "(" + data + ")").html );
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                       // alert('error ' + textStatus + " " + errorThrown);
                    }
                });
                },1000);