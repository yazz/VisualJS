    var call_on_click = function(addr) {
        //alert(addr);
        window.location.href  = 'http://' + addr;
        return false;
    };
    
    String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


    var checkHost = function(host) {
        var  blocked  =  '';
        $.ajax({
            type: "GET",
            url: "http://" + host + '/test_firewall',
            data: {
                tracking_id: '7698698768768', //generate a random number here
                server:      host
            },
            success: function(data) {
                //console.log("host:  "       + JSON.stringify(host,null,2) );
                //alert(JSON.stringify(data,null,2));
                var intranetGoShareDataHost = eval( "(" + data + ")").server;
                var quotedIntranetGoShareDataHost =  '"' + intranetGoShareDataHost + '"';
                blocked = '<div style="color: green; PADDING: 5PX;">(all ok)</div>';
                var newHtml =  "<div>" +
                            "<a href='#' onclick='call_on_click(" + quotedIntranetGoShareDataHost + ");'> " + intranetGoShareDataHost + "</a> </div>";
                var newid = intranetGoShareDataHost.replace(":",".").replaceAll(".","_");
                //console.log("newid: " + JSON.stringify(newid,null,2) + " = " + newHtml);
                $("#" + newid).html(newHtml);
                $("#" + newid + "_status").html(blocked);
                
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //console.log("host:  "       + JSON.stringify(host,null,2) );
                //alert(JSON.stringify(data,null,2));
                var intranetGoShareDataHost = host;
                var quotedIntranetGoShareDataHost =  '"' + intranetGoShareDataHost + '"';
                blocked = '<div style="color: red; PADDING: 5PX;">(probably behind a firewall)</div>';
                var newHtml =  "<div>" +
                            "<div> " + intranetGoShareDataHost + "</div> </div>";
                var newid = intranetGoShareDataHost.replace(":",".").replaceAll(".","_");
                //console.log("newid: " + JSON.stringify(newid,null,2) + " = " + newHtml);
                $("#" + newid).html(newHtml);
                $("#" + newid + "_status").html(blocked);
            }
        });
    }
    
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
                            var thisHost = intranetGoShareDataHost;
                            var elid = intranetGoShareDataHost.replace(":",".").replaceAll(".","_");
                            //console.log("elid:  " + JSON.stringify(elid,null,2) );
                            $("#local_machine_in_intranet").append('<div style="padding: 5px; display: inline-block;" id=' + elid + '>' + intranetGoShareDataHost + '</div>');
                            $("#local_machine_in_intranet").append('<div style="padding: 5px; display: inline-block;" id=' + elid + '_status> checking server...</div><BR>' );
                            
                            checkHost(intranetGoShareDataHost);
                        }                            
                        
                        
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $("#local_machine_in_intranet").html("Error. No local servers available on your intranet right now" );
                    }
                });
                };
    
    setTimeout(checkServers,800);
    setInterval(checkServers,4000);