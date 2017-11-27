var pdfjs_version    = '1.8.355',
    ViewerJS_version = '0.6.6';

function loadPlugin( pluginName, callback ) {
    "use strict";
    var script    = document.createElement('script');
    script.async  = false;
    script.onload = callback;
    script.src    = pluginName + '.js';
    script.type   = 'text/javascript';
    document.head.appendChild(script);
}
