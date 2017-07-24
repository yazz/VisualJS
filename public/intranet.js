    var call_on_click = function(addr) {
        //alert(addr);
        window.location.href  = 'http://' + addr;
        return false;
    };
    
    
    var checkServers = function() {
                $.ajax({
                    type: "GET",
                    url: '/get_intranet_servers',
                    success: function(data1) {
                        var returned= eval( "(" + data1 + ")");
                        var i = 0;
                        $("#local_machine_in_intranet").html(   '<div>Your intranet public IP:' + returned.intranetPublicIp + 
                                                                '</div><br>Your local servers:<br><br>');
                        for (i = 0 ; i < returned.allServers.length; i++) {
                            var ss = returned.allServers[i];
                            var intranetGoShareDataHost = ss.internal_host + ":" + ss.internal_port;
                            var  blocked  =  '';
                            $.ajax({
                                type: "GET",
                                url: "http://" + intranetGoShareDataHost + '/test_firewall',
                                data: {
                                    tracking_id: '7698698768768', //generate a random number here
                                    server:      intranetGoShareDataHost
                                },
                                success: function(data) {
                                    //alert(JSON.stringify(data,null,2));
                                    console.log( JSON.stringify(data,null,2) );
                                    var intranetGoShareDataHost = eval( "(" + data + ")").server;
                                    var quotedIntranetGoShareDataHost =  '"' + intranetGoShareDataHost + '"';
                                   blocked = '(all ok)';
                                    var newHtml =  "<div>" +
                                                "<a href='#' onclick='call_on_click(" + quotedIntranetGoShareDataHost + ");'> " + intranetGoShareDataHost + "</a> " +
                                                blocked + "</div>";
                                    $("#local_machine_in_intranet").append('<div>' + newHtml + '</div>' );
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    //var intranetGoShareDataHost = eval( "(" + data + ")").server;
                                    var quotedIntranetGoShareDataHost =  '"' + intranetGoShareDataHost + '"';
                                    blocked = '(Probably blocked by firewall)';
                                    var newHtml =  "<div>" +
                                                "<a href='#' onclick='call_on_click(" + quotedIntranetGoShareDataHost + ");'> " + intranetGoShareDataHost + "</a> " +
                                                blocked + "</div>";
                                    $("#local_machine_in_intranet").append('<div style="width: 200px;">' + newHtml + '</div>' );
                                }
                            });
                        }                            
                        
                        
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $("#local_machine_in_intranet").html("Error. No local servers available on your intranet right now" );
                    }
                });
                };
    
    checkServers();
    setInterval(checkServers,4000);