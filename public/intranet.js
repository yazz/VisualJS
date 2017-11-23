    var call_on_click = function(addr) {
        //alert(addr);
        window.location.href  = 'http://' + addr;
        return false;
    };
    
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
};
var inCheck = 0;

    var checkHost = function(host) {
        var  blocked  =  '';
        inCheck ++;
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
                var intranetGoShareDataHostUserName = eval( "(" + data + ")").username;
                var locked = eval( "(" + data + ")").locked;
                var lt = '';
                if ((locked == 'true') || locked) {
                    lt = "(Locked by " + intranetGoShareDataHostUserName + ")"
                }

                var quotedIntranetGoShareDataHost =  '"' + intranetGoShareDataHost + '"';
                blocked =  ' <span style="color: green; PADDING: 5PX;"> (all ok)' + '</span>';
                var newHtml =  "<div><a href='#' onclick='call_on_click(" + quotedIntranetGoShareDataHost + ");'> " + intranetGoShareDataHost + " </a> </div>";
                if (locked) {
                    newHtml = "<a href='#' onclick='call_on_click(" + quotedIntranetGoShareDataHost + ");'> " + intranetGoShareDataHost + " </a>" + " " + lt ;
                }
                var newid = intranetGoShareDataHost.replace(":",".").replaceAll(".","_");
                //console.log("newid: " + JSON.stringify(newid,null,2) + " = " + newHtml);
                $("#" + newid+ "_username").html(intranetGoShareDataHostUserName);
                $("#" + newid).html(newHtml);
                $("#" + newid + "_status").html("");
                $("#" + newid + "_result").html(blocked);
                inCheck --;
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
                $("#" + newid + "_status").html("");
                $("#" + newid + "_result").html(blocked);
                inCheck --;
            }
        });
    }
    
    var generated = false;
    
    var checkServers = function() {
        if (inCheck > 0) {
            return;
        }
                $.ajax({
                    type: "GET",
                    url: '/get_intranet_servers',
                    success: function(data1) {
                        var returned= eval( "(" + data1 + ")");
                        var i = 0;
                        if (!generated) {
                            //$("#local_machine_in_intranet").html(   '<div style="width: 300px">Your intranet public IP:' + returned.intranetPublicIp + 
                            //                                    '</div><br>Your local servers:<br><br>');
                            generated = true;
                        }
                        if (returned.allServers.length == 0) {
                            $("#local_machine_in_intranet").html(   '<div style=" font-family: helvetica;">No VisiFile servers on your intranet</div>');
                        } else {
                            $("#local_machine_in_intranet").html('');
                        };
                        for (i = 0 ; i < returned.allServers.length; i++) {
                            var ss = returned.allServers[i];
                            var intranetGoShareDataHost = ss.internal_host + ":" + ss.internal_port;
                            var thisHost = intranetGoShareDataHost;
                            var elid = intranetGoShareDataHost.replace(":",".").replaceAll(".","_");
                            //console.log("elid:  " + JSON.stringify(elid,null,2) );
                            if (!$('#' + elid).length) {
                                    $("#local_machine_in_intranet").append('<div style="font-family: helvetica; padding: 5px; display: inline-block;" id=' + elid + '_username>'  + '</div>');
                                    $("#local_machine_in_intranet").append('<div style="font-family: helvetica; padding: 5px; display: inline-block;" id=' + elid + '>' + intranetGoShareDataHost + '</div>');
                                    $("#local_machine_in_intranet").append('<div style="font-family: helvetica; padding: 5px; display: inline-block;" id=' + elid + '_status> checking server...</div>' );
                                    $("#local_machine_in_intranet").append('<div style="font-family: helvetica; padding: 5px; display: inline-block;" id=' + elid + '_result></div><BR>' );
                            }                            
                            checkHost(intranetGoShareDataHost);
                        };

                        
                        
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        $("#local_machine_in_intranet").html("Error. No local servers available on your intranet right now" );
                    }
                });
                };
    
    setTimeout(checkServers,800);
    setInterval(checkServers,4000);