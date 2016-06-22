


var ready = (function(){

    var readyList,
        DOMContentLoaded,
        class2type = {};
        class2type["[object Boolean]"] = "boolean";
        class2type["[object Number]"] = "number";
        class2type["[object String]"] = "string";
        class2type["[object Function]"] = "function";
        class2type["[object Array]"] = "array";
        class2type["[object Date]"] = "date";
        class2type["[object RegExp]"] = "regexp";
        class2type["[object Object]"] = "object";

    var ReadyObj = {
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,
        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,
        // Hold (or release) the ready event
        holdReady: function( hold ) {
            if ( hold ) {
                ReadyObj.readyWait++;
            } else {
                ReadyObj.ready( true );
            }
        },
        // Handle when the DOM is ready
        ready: function( wait ) {
            // Either a released hold or an DOMready/load event and not yet ready
            if ( (wait === true && !--ReadyObj.readyWait) || (wait !== true && !ReadyObj.isReady) ) {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if ( !document.body ) {
                    return setTimeout( ReadyObj.ready, 1 );
                }

                // Remember that the DOM is ready
                ReadyObj.isReady = true;
                // If a normal DOM Ready event fired, decrement, and wait if need be
                if ( wait !== true && --ReadyObj.readyWait > 0 ) {
                    return;
                }
                // If there are functions bound, to execute
                readyList.resolveWith( document, [ ReadyObj ] );

                // Trigger any bound ready events
                //if ( ReadyObj.fn.trigger ) {
                //  ReadyObj( document ).trigger( "ready" ).unbind( "ready" );
                //}
            }
        },
        bindReady: function() {
            if ( readyList ) {
                return;
            }
            readyList = ReadyObj._Deferred();

            // Catch cases where $(document).ready() is called after the
            // browser event has already occurred.
            if ( document.readyState === "complete" ) {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                return setTimeout( ReadyObj.ready, 1 );
            }

            // Mozilla, Opera and webkit nightlies currently support this event
            if ( document.addEventListener ) {
                // Use the handy event callback
                document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                // A fallback to window.onload, that will always work
                window.addEventListener( "load", ReadyObj.ready, false );

            // If IE event model is used
            } else if ( document.attachEvent ) {
                // ensure firing before onload,
                // maybe late but safe also for iframes
                document.attachEvent( "onreadystatechange", DOMContentLoaded );

                // A fallback to window.onload, that will always work
                window.attachEvent( "onload", ReadyObj.ready );

                // If IE and not a frame
                // continually check to see if the document is ready
                var toplevel = false;

                try {
                    toplevel = window.frameElement == null;
                } catch(e) {}

                if ( document.documentElement.doScroll && toplevel ) {
                    doScrollCheck();
                }
            }
        },
        _Deferred: function() {
            var // callbacks list
                callbacks = [],
                // stored [ context , args ]
                fired,
                // to avoid firing when already doing so
                firing,
                // flag to know if the deferred has been cancelled
                cancelled,
                // the deferred itself
                deferred  = {

                    // done( f1, f2, ...)
                    done: function() {
                        if ( !cancelled ) {
                            var args = arguments,
                                i,
                                length,
                                elem,
                                type,
                                _fired;
                            if ( fired ) {
                                _fired = fired;
                                fired = 0;
                            }
                            for ( i = 0, length = args.length; i < length; i++ ) {
                                elem = args[ i ];
                                type = ReadyObj.type( elem );
                                if ( type === "array" ) {
                                    deferred.done.apply( deferred, elem );
                                } else if ( type === "function" ) {
                                    callbacks.push( elem );
                                }
                            }
                            if ( _fired ) {
                                deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
                            }
                        }
                        return this;
                    },

                    // resolve with given context and args
                    resolveWith: function( context, args ) {
                        if ( !cancelled && !fired && !firing ) {
                            // make sure args are available (#8421)
                            args = args || [];
                            firing = 1;
                            try {
                                while( callbacks[ 0 ] ) {
                                    callbacks.shift().apply( context, args );//shifts a callback, and applies it to document
                                }
                            }
                            finally {
                                fired = [ context, args ];
                                firing = 0;
                            }
                        }
                        return this;
                    },

                    // resolve with this as context and given arguments
                    resolve: function() {
                        deferred.resolveWith( this, arguments );
                        return this;
                    },

                    // Has this deferred been resolved?
                    isResolved: function() {
                        return !!( firing || fired );
                    },

                    // Cancel
                    cancel: function() {
                        cancelled = 1;
                        callbacks = [];
                        return this;
                    }
                };

            return deferred;
        },
        type: function( obj ) {
            return obj == null ?
                String( obj ) :
                class2type[ Object.prototype.toString.call(obj) ] || "object";
        }
    }
    // The DOM ready check for Internet Explorer
    function doScrollCheck() {
        if ( ReadyObj.isReady ) {
            return;
        }

        try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll("left");
        } catch(e) {
            setTimeout( doScrollCheck, 1 );
            return;
        }

        // and execute any waiting functions
        ReadyObj.ready();
    }
    // Cleanup functions for the document ready method
    if ( document.addEventListener ) {
        DOMContentLoaded = function() {
            document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
            ReadyObj.ready();
        };

    } else if ( document.attachEvent ) {
        DOMContentLoaded = function() {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( document.readyState === "complete" ) {
                document.detachEvent( "onreadystatechange", DOMContentLoaded );
                ReadyObj.ready();
            }
        };
    }
    function ready( fn ) {
        // Attach the listeners
        ReadyObj.bindReady();

        var type = ReadyObj.type( fn );

        // Add the callback
        readyList.done( fn );//readyList is result of _Deferred()
    }
    return ready;
})();



function stringStartsWith (string, prefix) {
    return string.slice(0, prefix.length) == prefix;
}


function setCodeMirrorOption(optionname , optionvalue) {
  myCodeMirror.setOption(optionname, optionvalue);
}





      var toolbox = '<xml id="toolbox"  style="display: none"></xml>';


//<xml xmlns="http://www.w3.org/1999/xhtml">
//    <block type="appshare_ui_component" x="70" y="-90">
//        <statement name="main div element">
//             <block type="appshare_element_text">
//                 <field name="VALUE">Type text here</field>
//                 <next>
//                     <block type="appshare_element_box"></block>
//                 </next>
//             </block>
//         </statement>
//    </block>
//</xml>
      function findLastChild(el)
      {
        var blocks = el.getElementsByTagName("next");
        if (blocks.length == 0) {
          return el;
        }
        else {
          return findLastChild(blocks[0].children[0]);
        }
      }

      var component_list = [];
      var component_names = [];






      function rearrangeDom(dom)
      {
        var mainCustomComponents = document.createElement("custcomponents");

        var mainProg = document.createElement("block");
        mainProg.setAttribute("type","appshare_ui_component");
        var mainStatement = document.createElement("statement");
        mainStatement.setAttribute("name","main div element");
        mainProg.appendChild(mainStatement);

        lastblock = null;
        var blocks = dom.children;
        console.log("Block count: " + blocks.length);
        bc = blocks.length;
        var foundFirstMainUiBlock = false;
        component_list = [];
        component_names = [];
        for (i = 0; i  < bc; i++) {
          if (blocks[i].getAttribute('type') == 'appshare_custom_component') {
            var tt = blocks[i].children[0].textContent;
            component_list.push([tt,tt]);
            component_names.push(tt);
          }
        };

        for (i = 0; i  < bc; i++) {
          blocks = dom.children;
          block = blocks[0];
          block.removeAttribute('x');
          block.removeAttribute('y');
          console.log("next block is: " + i + " : " + block.getAttribute('type'));


          if (block.getAttribute('type') == 'appshare_call_custom_component') {
            childr = block.children;
            chi = childr[0];
            if (component_names.indexOf(chi.textContent) == -1 ) {
              console.log("call: " + " : " + chi.textContent);
              chi.textContent = 'default-component';
              //block.parentElement.removeChild(block);
            };

          }


          if (block.getAttribute('type') == 'appshare_custom_component') {
            mainCustomComponents.appendChild(block);
          }
          else if (block.getAttribute('type') == 'appshare_ui_component') {
            block.parentElement.removeChild(block);
          }

          else {
            if (foundFirstMainUiBlock == false) {
              mainStatement.appendChild(block);
            }
            else {
              var nextelement = document.createElement("next");
              lastblock.appendChild(nextelement);
              nextelement.appendChild(block);
            }
            foundFirstMainUiBlock = true;
            lastblock = findLastChild(block);
          }
        };




        var customBlocks = mainCustomComponents.children;
        customBlocksLength = customBlocks.length;
        for (i = 0; i  < customBlocksLength; i++) {
          customBlocks = mainCustomComponents.children;
          cblock = customBlocks[0];
          cblock.removeAttribute('x');
          cblock.removeAttribute('y');
          dom.appendChild(cblock);
        }
        dom.appendChild(mainProg);
      }

      function getBlocklyValue()
      {

        var dom = Blockly.Xml.workspaceToDom(workspace);
        var headlessWorkspace = new Blockly.Workspace();
        rearrangeDom(dom);
        Blockly.Xml.domToWorkspace(dom, headlessWorkspace);


        var inline = Blockly.ClojureScript.workspaceToCode(headlessWorkspace);
        headlessWorkspace.dispose();
        var code = inline;

        return code;
      }



      lastEval = -1;
      function myUpdateFunction(event) {
        if (event.type == 'ui') {return;}
        inEval = myappshare.mainapp.inEval();
        if (inEval) {return;}

        calcEvals = myappshare.mainapp.calcEvals();
        if (calcEvals == lastEval) {return;}

        lastEval = calcEvals;


        var code = getBlocklyValue();

        document.getElementById('blocklyCode').innerHTML = code;
        console.log("Event.type= " + event.type + " : " + calcEvals);
        document.getElementById('numberOfEvals').innerHTML = '' + calcEvals;
        //uuuttt(toolbox);
        myappshare.mainapp.refreshapp();
      }



      function getBlocklyXml()
      {
        var xml = Blockly.Xml.workspaceToDom(workspace);
        var code = Blockly.Xml.domToText(xml);
        //var code = Blockly.Xml.domToPrettyText(xml);
        return code;
      }


      function getBlocklyXml2()
      {

        var dom = Blockly.Xml.workspaceToDom(workspace);
        var headlessWorkspace = new Blockly.Workspace();
        rearrangeDom(dom);
        return dom;
      }


      function getBlocklyXml3()
      {

        var dom = Blockly.Xml.workspaceToDom(workspace);
        var headlessWorkspace = new Blockly.Workspace();
        rearrangeDom(dom);
        Blockly.Xml.domToWorkspace(dom, headlessWorkspace);


        var inline = Blockly.ClojureScript.workspaceToCode(headlessWorkspace);
        var dom = Blockly.Xml.workspaceToDom(headlessWorkspace);
        headlessWorkspace.dispose();
        var code = Blockly.Xml.domToText(dom);
        //var code = Blockly.Xml.domToPrettyText(xml);
        return code;
      }

      function setBlocklyXml(xml_text)
      {
        Blockly.mainWorkspace.clear();
        var xml = Blockly.Xml.textToDom(xml_text);
        Blockly.Xml.domToWorkspace(xml, workspace);
        centerBlocks();
      }


      function initBlockly() {

        workspace = Blockly.inject('blocklyDiv',
                                   {toolbox: toolbox,
                                   scrollbars: true,
                                    zoom:
         {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
                                    grid:
                                    {spacing: 20,
                                     length: 3,
                                     colour: '#ccc',
                                     snap: true},
                                   css: true});
        workspace.addChangeListener(myUpdateFunction);
        Blockly.fireUiEvent(window, 'resize')
        workspace.updateToolbox(toolbox);


        //headlessWorkspace = new Blockly.Workspace();

      }


      function uuuttt(ttt) {
        workspace.updateToolbox(ttt);
      }

      function refreshBlockly() {
        var xml = Blockly.Xml.workspaceToDom(workspace);
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(workspace, xml);
      }

      function refreshCodeMirror() {
        myCodeMirror.refresh();
      }

      function clearBlockly() {
        Blockly.mainWorkspace.clear();
      }

      function centerBlocks() {
        Blockly.mainWorkspace.scrollX =  250;
        Blockly.mainWorkspace.scrollY =  0;
        refreshBlockly();
         //Blockly.mainWorkspace.scrollbar.set(20,550);
      }

      function getComponentNames()
      {

        return "";
      }
