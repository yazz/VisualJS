function UnknownFilePlugin() {
    "use strict";

    var divElement = undefined,
        self       = this;

    function initCSS() {
    }

    function initButtons() {
        var leftToolbar                                          = document.getElementById('toolbarLeft');
        // hide unused elements
        document.getElementById("navButtons").style.display      = 'none';
        document.getElementById("pageNumberLabel").style.display = 'none';
        document.getElementById("pageNumber").style.display      = 'none';
        document.getElementById("numPages").style.display        = 'none';
        document.getElementById("toolbar").style.display         = 'none';
        document.getElementById("titlebarRight").style.display   = 'none';
        leftToolbar.style.visibility                             = "visible";

    }

    this.initialize = function ( viewerElement, documentUrl ) {
        divElement = document.createElement("div");
        divElement.setAttribute('class', 'unknown-file');
        divElement.innerHTML = 'This file cannot be previewed using your browser. <br><br><a class="download-button" href="' + documentUrl + '">Click here to download</a>';

        viewerElement.appendChild(divElement);
        viewerElement.style.overflow = "auto";

        self.onLoad();

        initCSS();
        initButtons();
    };

    this.isSlideshow = function () {
        return false;
    };

    this.onLoad = function () {
    };

    this.fitToWidth = function ( width ) {
    };

    this.fitToHeight = function ( height ) {
    };

    this.fitToPage = function ( width, height ) {
    };

    this.fitSmart = function ( width ) {
    };

    this.getZoomLevel = function () {
    };

    this.setZoomLevel = function ( value ) {
    };

    this.getPages = function () {
        return [1];
    };

    this.showPage = function ( n ) {
    };

    this.getPluginName = function () {
        return "UnknownFilePlugin";
    };

    this.getPluginVersion = function () {
        return "From Source";
    };

    this.getPluginURL = function () {
        return "https://github.com/vandernorth/ViewerJS";
    };
}
