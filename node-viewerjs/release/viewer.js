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
/**
 * Copyright (C) 2012-2015 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * This file is part of ViewerJS.
 *
 * ViewerJS is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License (GNU AGPL)
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * ViewerJS is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with ViewerJS.  If not, see <http://www.gnu.org/licenses/>.
 * @licend
 *
 * @source: http://viewerjs.org/
 * @source: http://github.com/kogmbh/ViewerJS
 */

/*
 * This file is a derivative from a part of Mozilla's PDF.js project. The
 * original license header follows.
 */

/* Copyright 2012 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global document, window*/

function Viewer( viewerPlugin, parameters ) {
    "use strict";

    var self               = this,
        kScrollbarPadding  = 40,
        kMinScale          = 0.25,
        kMaxScale          = 4.0,
        kDefaultScaleDelta = 1.1,
        kDefaultScale      = 'auto',
        presentationMode   = false,
        isFullScreen       = false,
        initialized        = false,
        url,
        viewerElement      = document.getElementById('viewer'),
        canvasContainer    = document.getElementById('canvasContainer'),
        overlayNavigator   = document.getElementById('overlayNavigator'),
        titlebar           = document.getElementById('titlebar'),
        toolbar            = document.getElementById('toolbarContainer'),
        pageSwitcher       = document.getElementById('toolbarLeft'),
        zoomWidget         = document.getElementById('toolbarMiddleContainer'),
        scaleSelector      = document.getElementById('scaleSelect'),
        dialogOverlay      = document.getElementById('dialogOverlay'),
        toolbarRight       = document.getElementById('toolbarRight'),
        pages              = [],
        currentPage,
        scaleChangeTimer,
        touchTimer,
        toolbarTouchTimer,
        UI_FADE_DURATION   = 5000;

    function isBlankedOut() {
        return (blanked.style.display === 'block');
    }

    function selectScaleOption( value ) {
        // Retrieve the options from the zoom level <select> element
        var options              = scaleSelector.options,
            option,
            predefinedValueFound = false,
            i;

        for ( i = 0; i < options.length; i += 1 ) {
            option = options[i];
            if ( option.value !== value ) {
                option.selected = false;
                continue;
            }
            option.selected      = true;
            predefinedValueFound = true;
        }
        return predefinedValueFound;
    }

    function getPages() {
        return viewerPlugin.getPages();
    }

    function setScale( val, resetAutoSettings ) {
        if ( val === self.getZoomLevel() ) {
            return;
        }

        self.setZoomLevel(val);

        var event = document.createEvent('UIEvents');
        event.initUIEvent('scalechange', false, false, window, 0);
        event.scale             = val;
        event.resetAutoSettings = resetAutoSettings;
        window.dispatchEvent(event);
    }

    function onScroll() {
        var pageNumber;

        if ( viewerPlugin.onScroll ) {
            viewerPlugin.onScroll();
        }
        if ( viewerPlugin.getPageInView ) {
            pageNumber = viewerPlugin.getPageInView();
            if ( pageNumber ) {
                currentPage                                 = pageNumber;
                document.getElementById('pageNumber').value = pageNumber;
            }
        }
    }

    function delayedRefresh( milliseconds ) {
        window.clearTimeout(scaleChangeTimer);
        scaleChangeTimer = window.setTimeout(function () {
            onScroll();
        }, milliseconds);
    }

    function parseScale( value, resetAutoSettings ) {
        var scale,
            maxWidth,
            maxHeight;

        if ( value === 'custom' ) {
            scale = parseFloat(document.getElementById('customScaleOption').textContent) / 100;
        } else {
            scale = parseFloat(value);
        }

        if ( scale ) {
            setScale(scale, true);
            delayedRefresh(300);
            return;
        }

        maxWidth  = canvasContainer.clientWidth - kScrollbarPadding;
        maxHeight = canvasContainer.clientHeight - kScrollbarPadding;

        switch ( value ) {
            case 'page-actual':
                setScale(1, resetAutoSettings);
                break;
            case 'page-width':
                viewerPlugin.fitToWidth(maxWidth);
                break;
            case 'page-height':
                viewerPlugin.fitToHeight(maxHeight);
                break;
            case 'page-fit':
                viewerPlugin.fitToPage(maxWidth, maxHeight);
                break;
            case 'auto':
                if ( viewerPlugin.isSlideshow() ) {
                    viewerPlugin.fitToPage(maxWidth + kScrollbarPadding, maxHeight + kScrollbarPadding);
                } else {
                    viewerPlugin.fitSmart(maxWidth);
                }
                break;
        }

        selectScaleOption(value);
        delayedRefresh(300);
    }

    function readZoomParameter( zoom ) {
        var validZoomStrings = ["auto", "page-actual", "page-width"],
            number;

        if ( validZoomStrings.indexOf(zoom) !== -1 ) {
            return zoom;
        }
        number = parseFloat(zoom);
        if ( number && kMinScale <= number && number <= kMaxScale ) {
            return zoom;
        }
        return kDefaultScale;
    }

    function readStartPageParameter( startPage ) {
        var result = parseInt(startPage, 10);
        return isNaN(result) ? 1 : result;
    }

    this.initialize = function () {
        var initialScale;

        initialScale = readZoomParameter(parameters.zoom);

        url                    = parameters.documentUrl;
        document.title         = parameters.title;
        var documentName       = document.getElementById('documentName');
        documentName.innerHTML = "";
        documentName.appendChild(documentName.ownerDocument.createTextNode(parameters.title));

        viewerPlugin.onLoad = function () {

            if ( viewerPlugin.isSlideshow() ) {
                // Slideshow pages should be centered
                canvasContainer.classList.add("slideshow");
                // Show page nav controls only for presentations
                pageSwitcher.style.visibility = 'visible';
            } else {
                // For text documents, show the zoom widget.
                zoomWidget.style.visibility = 'visible';
                // Only show the page switcher widget if the plugin supports page numbers
                if ( viewerPlugin.getPageInView ) {
                    pageSwitcher.style.visibility = 'visible';
                }
            }

            initialized                                   = true;
            pages                                         = getPages();
            document.getElementById('numPages').innerHTML = 'of ' + pages.length;

            self.showPage(readStartPageParameter(parameters.startpage));

            // Set default scale
            parseScale(initialScale);

            canvasContainer.onscroll = onScroll;
            delayedRefresh();
            // Doesn't work in older browsers: document.getElementById('loading-document').remove();
            var loading = document.getElementById('loading-document');
            loading.parentNode.removeChild(loading);
        };

        viewerPlugin.initialize(canvasContainer, url);
    };

    /**
     * Shows the 'n'th page. If n is larger than the page count,
     * shows the last page. If n is less than 1, shows the first page.
     * @return {undefined}
     */
    this.showPage = function ( n ) {
        if ( n <= 0 ) {
            n = 1;
        } else if ( n > pages.length ) {
            n = pages.length;
        }

        viewerPlugin.showPage(n);

        currentPage                                 = n;
        document.getElementById('pageNumber').value = currentPage;
    };

    /**
     * Shows the next page. If there is no subsequent page, does nothing.
     * @return {undefined}
     */
    this.showNextPage = function () {
        self.showPage(currentPage + 1);
    };

    /**
     * Shows the previous page. If there is no previous page, does nothing.
     * @return {undefined}
     */
    this.showPreviousPage = function () {
        self.showPage(currentPage - 1);
    };

    /**
     * Attempts to 'download' the file.
     * @return {undefined}
     */
    this.download = function () {
        var documentUrl = url.split('#')[0];
        if ( documentUrl.indexOf('?') !== -1 ) {
            documentUrl += '&contentDispositionType=attachment';
        } else {
            documentUrl += '?contentDispositionType=attachment';
        }
        window.open(documentUrl, '_parent');
    };

    /**
     * Prints the document canvas.
     * @return {undefined}
     */
    this.printDocument = function () {
        window.print();
    };

    /**
     * Toggles the fullscreen state of the viewer
     * @return {undefined}
     */
    this.toggleFullScreen = function () {
        var elem = viewerElement;
        if ( !isFullScreen ) {
            if ( elem.requestFullscreen ) {
                elem.requestFullscreen();
            } else if ( elem.mozRequestFullScreen ) {
                elem.mozRequestFullScreen();
            } else if ( elem.webkitRequestFullscreen ) {
                elem.webkitRequestFullscreen();
            } else if ( elem.webkitRequestFullScreen ) {
                elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if ( elem.msRequestFullscreen ) {
                elem.msRequestFullscreen();
            }
        } else {
            if ( document.exitFullscreen ) {
                document.exitFullscreen();
            } else if ( document.cancelFullScreen ) {
                document.cancelFullScreen();
            } else if ( document.mozCancelFullScreen ) {
                document.mozCancelFullScreen();
            } else if ( document.webkitExitFullscreen ) {
                document.webkitExitFullscreen();
            } else if ( document.webkitCancelFullScreen ) {
                document.webkitCancelFullScreen();
            } else if ( document.msExitFullscreen ) {
                document.msExitFullscreen();
            }
        }
    };

    /**
     * Toggles the presentation mode of the viewer.
     * Presentation mode involves fullscreen + hidden UI controls
     */
    this.togglePresentationMode = function () {
        var overlayCloseButton = document.getElementById('overlayCloseButton');

        if ( !presentationMode ) {
            titlebar.style.display = toolbar.style.display = 'none';
            overlayCloseButton.style.display = 'block';
            canvasContainer.classList.add('presentationMode');
            canvasContainer.onmousedown   = function ( event ) {
                event.preventDefault();
            };
            canvasContainer.oncontextmenu = function ( event ) {
                event.preventDefault();
            };
            canvasContainer.onmouseup     = function ( event ) {
                event.preventDefault();
                if ( event.which === 1 ) {
                    self.showNextPage();
                } else {
                    self.showPreviousPage();
                }
            };
            parseScale('page-fit');
        } else {
            if ( isBlankedOut() ) {
                leaveBlankOut();
            }
            titlebar.style.display = toolbar.style.display = 'block';
            overlayCloseButton.style.display = 'none';
            canvasContainer.classList.remove('presentationMode');
            canvasContainer.onmouseup     = function () {
            };
            canvasContainer.oncontextmenu = function () {
            };
            canvasContainer.onmousedown   = function () {
            };
            parseScale('auto');
        }

        presentationMode = !presentationMode;
    };

    /**
     * Gets the zoom level of the document
     * @return {!number}
     */
    this.getZoomLevel = function () {
        return viewerPlugin.getZoomLevel();
    };

    /**
     * Set the zoom level of the document
     * @param {!number} value
     * @return {undefined}
     */
    this.setZoomLevel = function ( value ) {
        viewerPlugin.setZoomLevel(value);
    };

    /**
     * Zoom out by 10 %
     * @return {undefined}
     */
    this.zoomOut = function () {
        // 10 % decrement
        var newScale = (self.getZoomLevel() / kDefaultScaleDelta).toFixed(2);
        newScale     = Math.max(kMinScale, newScale);
        parseScale(newScale, true);
    };

    /**
     * Zoom in by 10%
     * @return {undefined}
     */
    this.zoomIn = function () {
        // 10 % increment
        var newScale = (self.getZoomLevel() * kDefaultScaleDelta).toFixed(2);
        newScale     = Math.min(kMaxScale, newScale);
        parseScale(newScale, true);
    };

    function cancelPresentationMode() {
        if ( presentationMode && !isFullScreen ) {
            self.togglePresentationMode();
        }
    }

    function handleFullScreenChange() {
        isFullScreen = !isFullScreen;
        cancelPresentationMode();
    }

    function showOverlayNavigator() {
        if ( presentationMode || viewerPlugin.isSlideshow() ) {
            overlayNavigator.className = 'viewer-touched';
            window.clearTimeout(touchTimer);
            touchTimer = window.setTimeout(function () {
                overlayNavigator.className = '';
            }, UI_FADE_DURATION);
        }
    }

    /**
     */
    function showToolbars() {
        titlebar.classList.add('viewer-touched');
        toolbar.classList.add('viewer-touched');
        window.clearTimeout(toolbarTouchTimer);
        toolbarTouchTimer = window.setTimeout(function () {
            hideToolbars();
        }, UI_FADE_DURATION);
    }

    function hideToolbars() {
        titlebar.classList.remove('viewer-touched');
        toolbar.classList.remove('viewer-touched');
    }

    function toggleToolbars() {
        if ( titlebar.classList.contains('viewer-touched') ) {
            hideToolbars();
        } else {
            showToolbars();
        }
    }

    function blankOut( value ) {
        blanked.style.display         = 'block';
        blanked.style.backgroundColor = value;
        hideToolbars();
    }

    function leaveBlankOut() {
        blanked.style.display = 'none';
        toggleToolbars();
    }

    function setButtonClickHandler( buttonId, handler ) {
        var button = document.getElementById(buttonId);

        button.addEventListener('click', function () {
            handler();
            button.blur();
        });
    }

    function init() {

        if ( viewerPlugin ) {
            self.initialize();

            if ( !(document.exitFullscreen || document.cancelFullScreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.webkitCancelFullScreen || document.msExitFullscreen) ) {
                document.getElementById('fullscreen').style.visibility   = 'hidden';
                document.getElementById('presentation').style.visibility = 'hidden';
            }

            setButtonClickHandler('overlayCloseButton', self.toggleFullScreen);
            setButtonClickHandler('fullscreen', self.toggleFullScreen);
            setButtonClickHandler('print', self.printDocument);
            setButtonClickHandler('presentation', function () {
                if ( !isFullScreen ) {
                    self.toggleFullScreen();
                }
                self.togglePresentationMode();
            });

            document.addEventListener('fullscreenchange', handleFullScreenChange);
            document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
            document.addEventListener('mozfullscreenchange', handleFullScreenChange);
            document.addEventListener('MSFullscreenChange', handleFullScreenChange);

            setButtonClickHandler('download', self.download);

            setButtonClickHandler('zoomOut', self.zoomOut);
            setButtonClickHandler('zoomIn', self.zoomIn);

            setButtonClickHandler('previous', self.showPreviousPage);
            setButtonClickHandler('next', self.showNextPage);

            setButtonClickHandler('previousPage', self.showPreviousPage);
            setButtonClickHandler('nextPage', self.showNextPage);

            document.getElementById('pageNumber').addEventListener('change', function () {
                self.showPage(this.value);
            });

            document.getElementById('scaleSelect').addEventListener('change', function () {
                parseScale(this.value);
            });

            canvasContainer.addEventListener('click', showOverlayNavigator);
            overlayNavigator.addEventListener('click', showOverlayNavigator);
            canvasContainer.addEventListener('click', toggleToolbars);
            titlebar.addEventListener('click', showToolbars);
            toolbar.addEventListener('click', showToolbars);

            window.addEventListener('scalechange', function ( evt ) {
                var customScaleOption    = document.getElementById('customScaleOption'),
                    predefinedValueFound = selectScaleOption(String(evt.scale));

                customScaleOption.selected = false;

                if ( !predefinedValueFound ) {
                    customScaleOption.textContent = Math.round(evt.scale * 10000) / 100 + '%';
                    customScaleOption.selected    = true;
                }
            }, true);

            window.addEventListener('resize', function () {
                if ( initialized &&
                    (document.getElementById('pageWidthOption').selected ||
                    document.getElementById('pageAutoOption').selected) ) {
                    parseScale(document.getElementById('scaleSelect').value);
                }
                showOverlayNavigator();
            });

            window.addEventListener('keydown', function ( evt ) {
                var key      = evt.keyCode,
                    shiftKey = evt.shiftKey;

                // blanked-out mode?
                if ( isBlankedOut() ) {
                    switch ( key ) {
                        case 16: // Shift
                        case 17: // Ctrl
                        case 18: // Alt
                        case 91: // LeftMeta
                        case 93: // RightMeta
                        case 224: // MetaInMozilla
                        case 225: // AltGr
                            // ignore modifier keys alone
                            break;
                        default:
                            leaveBlankOut();
                            break;
                    }
                } else {
                    switch ( key ) {
                        case 8: // backspace
                        case 33: // pageUp
                        case 37: // left arrow
                        case 38: // up arrow
                        case 80: // key 'p'
                            self.showPreviousPage();
                            break;
                        case 13: // enter
                        case 34: // pageDown
                        case 39: // right arrow
                        case 40: // down arrow
                        case 78: // key 'n'
                            self.showNextPage();
                            break;
                        case 32: // space
                            shiftKey ? self.showPreviousPage() : self.showNextPage();
                            break;
                        case 66:  // key 'b' blanks screen (to black) or returns to the document
                        case 190: // and so does the key '.' (dot)
                            if ( presentationMode ) {
                                blankOut('#000');
                            }
                            break;
                        case 87:  // key 'w' blanks page (to white) or returns to the document
                        case 188: // and so does the key ',' (comma)
                            if ( presentationMode ) {
                                blankOut('#FFF');
                            }
                            break;
                        case 36: // key 'Home' goes to first page
                            self.showPage(1);
                            break;
                        case 35: // key 'End' goes to last page
                            self.showPage(pages.length);
                            break;
                    }
                }
            });
        }
    }

    init();
}
/**
 * Copyright (C) 2012-2015 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * This file is part of ViewerJS.
 *
 * ViewerJS is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License (GNU AGPL)
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * ViewerJS is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with ViewerJS.  If not, see <http://www.gnu.org/licenses/>.
 * @licend
 *
 * @source: http://viewerjs.org/
 * @source: http://github.com/kogmbh/ViewerJS
 */

/*global document, window, Viewer, ODFViewerPlugin, PDFViewerPlugin*/

(function () {
    "use strict";

    var css,
        pluginRegistry  = [
            (function () {
                var odfMimetypes      = [
                    'application/vnd.oasis.opendocument.text',
                    'application/vnd.oasis.opendocument.text-flat-xml',
                    'application/vnd.oasis.opendocument.text-template',
                    'application/vnd.oasis.opendocument.presentation',
                    'application/vnd.oasis.opendocument.presentation-flat-xml',
                    'application/vnd.oasis.opendocument.presentation-template',
                    'application/vnd.oasis.opendocument.spreadsheet',
                    'application/vnd.oasis.opendocument.spreadsheet-flat-xml',
                    'application/vnd.oasis.opendocument.spreadsheet-template'];
                var odfFileExtensions = [
                    'odt',
                    'fodt',
                    'ott',
                    'odp',
                    'fodp',
                    'otp',
                    'ods',
                    'fods',
                    'ots'];

                return {
                    supportsMimetype:      function ( mimetype ) {
                        return (odfMimetypes.indexOf(mimetype) !== -1);
                    },
                    supportsFileExtension: function ( extension ) {
                        return (odfFileExtensions.indexOf(extension) !== -1);
                    },
                    path:                  "./ODFViewerPlugin",
                    getClass:              function () {
                        return ODFViewerPlugin;
                    }
                };
            }()),
            {
                supportsMimetype:      function ( mimetype ) {
                    return (mimetype === 'application/pdf');
                },
                supportsFileExtension: function ( extension ) {
                    return (extension === 'pdf');
                },
                path:                  "./PDFViewerPlugin",
                getClass:              function () {
                    return PDFViewerPlugin;
                }
            },
            (function () {
                var imageMimetypes      = [
                    'image/jpeg',
                    'image/pjpeg',
                    'image/gif',
                    'image/png',
                    'image/bmp'];
                var imageFileExtensions = [
                    'png',
                    'jpg',
                    'jpeg',
                    'gif',
                    'bmp'];

                return {
                    supportsMimetype:      function ( mimetype ) {
                        return (imageMimetypes.indexOf(mimetype) !== -1);
                    },
                    supportsFileExtension: function ( extension ) {
                        return (imageFileExtensions.indexOf(extension) !== -1);
                    },
                    path:                  "./ImageViewerPlugin",
                    getClass:              function () {
                        return ImageViewerPlugin;
                    }
                };
            }()),
            (function () {
                var multimediaMimetypes      = [
                    'video/mp4',
                    'video/ogg',
                    'video/webm',
                    'audio/aac',
                    'audio/mp4',
                    'audio/mpeg',
                    'audio/ogg',
                    'audio/wav',
                    'audio/webm'];
                var multimediaFileExtensions = [
                    'aac',
                    'mp4',
                    'm4a',
                    'mp3',
                    'mpg',
                    'mpeg',
                    'ogg',
                    'wav',
                    'webm',
                    'm4v',
                    'ogv',
                    'oga',
                    'mp1',
                    'mp2'];

                return {
                    supportsMimetype:      function ( mimetype ) {
                        return (multimediaMimetypes.indexOf(mimetype) !== -1);
                    },
                    supportsFileExtension: function ( extension ) {
                        return (multimediaFileExtensions.indexOf(extension) !== -1);
                    },
                    path:                  "./MultimediaViewerPlugin",
                    getClass:              function () {
                        return MultimediaViewerPlugin;
                    }
                };
            }())
        ],
        unknownFileType = {
            supportsMimetype:      function () {
                return true;
            },
            supportsFileExtension: function () {
                return true;
            },
            path:                  "./UnknownFilePlugin",
            getClass:              function () {
                return UnknownFilePlugin;
            }
        };

    function estimateTypeByHeaderContentType( documentUrl, cb ) {
        var xhr                = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            var mimetype, matchingPluginData;
            if ( xhr.readyState === 4 ) {
                if ( (xhr.status >= 200 && xhr.status < 300) || xhr.status === 0 ) {
                    mimetype = xhr.getResponseHeader('content-type');

                    if ( mimetype ) {
                        pluginRegistry.some(function ( pluginData ) {
                            if ( pluginData.supportsMimetype(mimetype) ) {
                                matchingPluginData = pluginData;
                                console.log('Found plugin by mimetype and xhr head: ' + mimetype);
                                // store the mimetype globally
                                window.mimetype = mimetype;
                                return true;
                            }
                            return false;
                        });
                    }
                }
                if ( !matchingPluginData ) {
                    matchingPluginData = unknownFileType;
                }
                cb(matchingPluginData);
            }
        };
        xhr.open("HEAD", documentUrl, true);
        xhr.send();
    }

    function doEstimateTypeByFileExtension( extension ) {
        var matchingPluginData;

        pluginRegistry.some(function ( pluginData ) {
            if ( pluginData.supportsFileExtension(extension) ) {
                matchingPluginData = pluginData;
                return true;
            }
            return false;
        });

        return matchingPluginData;
    }

    function estimateTypeByFileExtension( extension ) {
        var matchingPluginData = doEstimateTypeByFileExtension(extension)

        if ( matchingPluginData ) {
            console.log('Found plugin by parameter type: ' + extension);

            // this is needed for the Multimedia Plugin
            window.mimetype = getMimeByExtension(extension);
        }

        return matchingPluginData;
    }

    function estimateTypeByFileExtensionFromPath( documentUrl ) {
        // See to get any path from the url and grep what could be a file extension
        var documentPath       = documentUrl.split('?')[0],
            extension          = documentPath.split('.').pop(),
            matchingPluginData = doEstimateTypeByFileExtension(extension)

        if ( matchingPluginData ) {
            console.log('Found plugin by file extension from path: ' + extension);
        }

        return matchingPluginData;
    }

    function parseSearchParameters( location ) {
        var parameters = {},
            search     = location.search || "?";

        search.substr(1).split('&').forEach(function ( q ) {
            // skip empty strings
            if ( !q ) {
                return;
            }
            // if there is no '=', have it handled as if given key was set to undefined
            var s                                = q.split('=', 2);
            parameters[decodeURIComponent(s[0])] = decodeURIComponent(s[1]);
        });

        return parameters;
    }

    function getMimeByExtension( ext ) {
        var extToMimes = {
            'aac':  'audio/aac',
            'mp4':  'video/mp4',
            'm4a':  'audio/mp4',
            'mp3':  'audio/mpeg',
            'mpg':  'video/mpeg',
            'mpeg': 'video/mpeg',
            'ogg':  'video/ogg',
            'wav':  'audio/wav',
            'webm': 'video/webm',
            'm4v':  'video/mp4',
            'ogv':  'video/ogg',
            'oga':  'audio/ogg',
            'mp1':  'audio/mpeg',
            'mp2':  'audio/mpeg'
        };

        if ( extToMimes.hasOwnProperty(ext) ) {
            return extToMimes[ext];
        }
        return false;
    }

    window.onload = function () {
        var viewer,
            documentUrl = document.location.hash.substring(1),
            parameters  = parseSearchParameters(document.location),
            Plugin;

        if ( documentUrl ) {
            // try to guess the title as filename from the location, if not set by parameter
            if ( !parameters.title ) {
                parameters.title = documentUrl.replace(/^.*[\\\/]/, '');
            }

            parameters.documentUrl = documentUrl;

            // trust the server most
            estimateTypeByHeaderContentType(documentUrl, function ( pluginData ) {
                if ( !pluginData ) {
                    if ( parameters.type ) {
                        pluginData = estimateTypeByFileExtension(parameters.type);
                    } else {
                        // last ressort: try to guess from path
                        pluginData = estimateTypeByFileExtensionFromPath(documentUrl);
                    }
                }

                if ( pluginData ) {
                    if ( String(typeof loadPlugin) !== "undefined" ) {
                        loadPlugin(pluginData.path, function () {
                            Plugin = pluginData.getClass();
                            viewer = new Viewer(new Plugin(), parameters);
                        });
                    } else {
                        Plugin = pluginData.getClass();
                        viewer = new Viewer(new Plugin(), parameters);
                    }
                } else {
                    viewer = new Viewer();
                }
            });
        } else {
            viewer = new Viewer();
        }
    };

    /*css = (document.createElementNS(document.head.namespaceURI, 'style'));
     css.setAttribute('media', 'screen');
     css.setAttribute('type', 'text/css');
     css.appendChild(document.createTextNode(viewer_css));
     document.head.appendChild(css);

     css = (document.createElementNS(document.head.namespaceURI, 'style'));
     css.setAttribute('media', 'only screen and (max-device-width: 800px) and (max-device-height: 800px)');
     css.setAttribute('type', 'text/css');
     css.setAttribute('viewerTouch', '1');
     css.appendChild(document.createTextNode(viewerTouch_css));
     document.head.appendChild(css);
     */
}());
