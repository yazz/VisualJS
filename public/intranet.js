    var call_on_click = function(addr) {
        //alert(addr);
        window.location.href  = addr;
    };
        setInterval(
            function() {
                $.ajax({
                    type: "GET",
                    url: '/get_intranet_servers',
                    success: function(data1) {
                        var  blocked  =  '';
                        if (typeof data1.localServer !== "undefined"){
                            $.ajax({
                                type: "GET",
                                url: data1.localServer + '/test_firewall',
                                data: {
                                    tracking_id: '7698698768768' //generate a random number here
                                },
                                success: function(data) {
                                    //alert(JSON.stringify(data,null,2));
                                    console.log( JSON.stringify(data,null,2) );
                                    $("#local_machine_in_intranet").html(eval( "(" + data1 + ")").html + blocked );
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                   //alert('firewall blocked' + textStatus + " " + errorThrown);
                                   //blocked = ' (Probably blocked by firewall)'
                                   $("#local_machine_in_intranet").html(eval( "(" + data1 + ")").html + blocked );
                                }
                            });
                        } else {
                            $("#local_machine_in_intranet").html(eval( "(" + data1 + ")").html + blocked );
                        } 
                        
                        
                        
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $("#local_machine_in_intranet").html("Error. No local servers available on your intranet right now" );
                    }
                });
                
                
                

                
                },1000);