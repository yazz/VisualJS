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
                        $("#local_machine_in_intranet").html("Error" );
                    }
                });
                
                
                
                $.ajax({
                    type: "GET",
                    url: 'http://192.168.1.129/test_firewall',
                    data: {
                        tracking_id: '7698698768768'
                    },
                    success: function(data) {
                        //alert(JSON.stringify(data,null,2));
                        console.log( JSON.stringify(data,null,2) );
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                       //alert('firewall blocked' + textStatus + " " + errorThrown);
                    }
                });

                
                },1000);