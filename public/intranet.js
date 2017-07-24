    var call_on_click = function(addr) {
        //alert(addr);
        window.location.href  = addr;
        return false;
    };
        setInterval(
            function() {
                $.ajax({
                    type: "GET",
                    url: '/get_intranet_servers',
                    success: function(data1) {
                        var  blocked  =  '';
                        var returned= eval( "(" + data1 + ")");
                        console.log("data1.localServer: " + returned.localServer);
                        if ((typeof returned.localServer !== "undefined") && (returned.localServer)){ 
                            $.ajax({
                                type: "GET",
                                url: returned.localServer + '/test_firewall',
                                data: {
                                    tracking_id: '7698698768768' //generate a random number here
                                },
                                success: function(data) {
                                    //alert(JSON.stringify(data,null,2));
                                    console.log( JSON.stringify(data,null,2) );
                                   blocked = '<div> (all ok)</div>';
                                    $("#local_machine_in_intranet").html('<div>' + returned.html + blocked + '</div>');
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                   //alert('firewall blocked' + textStatus + " " + errorThrown);
                                   blocked = '<div> (Probably blocked by firewall)</div>';
                                   $("#local_machine_in_intranet").html('<div>' + returned.html + blocked  + '</div>');
                                }
                            });
                        } else {
                            $("#local_machine_in_intranet").html('<div>' + returned.html + 'NO LOCAL NODE</div>' );
                        } 
                        
                        
                        
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $("#local_machine_in_intranet").html("Error. No local servers available on your intranet right now" );
                    }
                });
                
                
                

                
                },1000);