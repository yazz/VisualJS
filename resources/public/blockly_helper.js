// --------------------------------------------------------------------
//                           BLOCKLY TOOLBOX
// --------------------------------------------------------------------
var toolbox = '<xml id="toolbox"  style="display: none"></xml>';



// --------------------------------------------------------------------
//       ALL THE FUNCTIONS IN A BLOCKLY PROGRAM ARE STORED HERE
// --------------------------------------------------------------------
var component_list = [];




// --------------------------------------------------------------------
//   NAMES OF ALL THE FUNCTIONS IN A BLOCKLY PROGRAM ARE STORED HERE
//
//   It could be argued that this is not needed as it is information
//   already stored in "component_list", so maybe we can get rid of this
//   soon
// --------------------------------------------------------------------
var component_names = [];




// --------------------------------------------------------------------
//       USED TO FIGURE OUT WHEN TEXT IN A BLOCKLY FIELD HAS CHANGED
// --------------------------------------------------------------------
var lastkeypresstime = -1;
var updateblockly = false;
var keypressed = false;
var savelagtime = 3000;
var lastEval = -1;


// --------------------------------------------------------------------
//                     EXAMPLE XML FOR BLOCKLY CODE
// --------------------------------------------------------------------
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





// --------------------------------------------------------------------
//                              FUNCTIONS TO
//      MAKE ON SCREEN BLOCKLY LOOK NICE TO THE BLOCKLY COMPILER
// --------------------------------------------------------------------
function findLastChild( el )
{
  var blocks = el.getElementsByTagName("next");
  if (blocks.length == 0) {
    return el;
  }
  else {
    return findLastChild(blocks[0].children[0]);
  }
}



function findFirstNextElement(el)
{
  var blocks = el.children;
  var bc = blocks.length;
  if (bc == 0) {
    return el;
  }

  var hasNext = false;
  var foundblock = null;
  for (i = 0; i  < bc; i++) {
    if (blocks[i].tagName.toUpperCase() == 'NEXT') {
      hasNext = true;
      foundblock = blocks[i].children[0];
    }
  }

  if (hasNext == true) {
    console.log('findLastChild: ' + foundblock.tagName);
    return findFirstNextElement(foundblock);
  }

  return el;
}






// --------------------------------------------------------------------
//  function rearrangeDom
//  input:        dom
//  output:       none
//  side effects: Rearranges the dom passed in
//
//
// this function rearranges the XML for blockly so that it can be parsed by
// the blockly compiler to make valid clojure code
//
// --------------------------------------------------------------------
function rearrangeDom(dom)
{
  //
  // Save the names of all the custom components
  //
  var blocks = dom.children;
  //console.log("Block count: " + blocks.length);
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





  //
  // make a main element for the program, which contains a main div statement.
  // Inside this div statement place all the blocks which
  // are just 'hanging around' so that we can show something on
  // the screen
  //
  // keep the custom components at the top
  var mainCustomComponents = document.createElement("custcomponents");
  var defineDbComponents = document.createElement("definedbcomponents");

  var mainProgramBlocklycomponent = document.createElement("block");
  mainProgramBlocklycomponent.setAttribute("type","appshare_ui_component");

  var mainStatement = document.createElement("statement");
  mainStatement.setAttribute("name","main div element");
  mainProgramBlocklycomponent.appendChild(mainStatement);

  lastblock = null;

  // go through all the top level blocks
  for (var bi = 0; bi  < bc; bi++) {
    blocks = dom.children;
    block = blocks[0];

    // remove any screen positions from the blocks since we are rearranging them
    block.removeAttribute('x');
    block.removeAttribute('y');
    //console.log("next block is: " + bi + " : " + block.getAttribute('type'));


    // if it is a custom component then make sure it calls something valid
    if (block.getAttribute('type') == 'appshare_call_custom_component') {
      childr = block.children;
      chi = childr[0];
      if (component_names.indexOf(chi.textContent) == -1 ) {
        //console.log("call: " + " : " + chi.textContent);
        chi.textContent = 'default-component';
        //block.parentElement.removeChild(block);
      };
    }


    // if it is a custom component then move it to the top
    if (block.getAttribute('type') == 'appshare_custom_component') {
      //console.log("Found custom component ");
      mainCustomComponents.appendChild(block);
    }
    // if it is a deprecated UI component then remove it
    else if (block.getAttribute('type') == 'appshare_ui_component') {
      //console.log("Removed block ");
      block.parentElement.removeChild(block);
    }

    // if it is a code then remove it
    else if (block.getAttribute('type').startsWith('appshare_code_')) {
      //console.log("Removed block ");
      block.parentElement.removeChild(block);
    }
    // if it is defining the database then remove it
    else if (block.getAttribute('type').startsWith('appshare_definedb_')) {
      //console.log("Removed block ");
      //block.parentElement.removeChild(block);
      defineDbComponents.appendChild(block);
    }

    // otherwise it is a UI component
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
      lastblock = findFirstNextElement(block);
      //console.log("    last block is: " + bi + " : " + lastblock.getAttribute('type'));
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




  var defineDbBlocks = defineDbComponents.children;
  defineDbBlocksLength = defineDbBlocks.length;
  for (i = 0; i  < defineDbBlocksLength; i++) {
    defineDbBlocks = defineDbComponents.children;
    cblock = defineDbBlocks[0];
    cblock.removeAttribute('x');
    cblock.removeAttribute('y');
    dom.appendChild(cblock);
  }

  dom.appendChild(mainProgramBlocklycomponent);

}










// --------------------------------------------------------------------
//                      function getBlocklyValue
//
//  input:        none
//  output:       the clojure code represented by blockly
//  dependencies: The global blockly workspace
//
// --------------------------------------------------------------------
function getBlocklyValue()
{

  var dom = Blockly.Xml.workspaceToDom(workspace);
  var headlessWorkspace = new Blockly.Workspace();
  rearrangeDom(dom);
  Blockly.Xml.domToWorkspace(dom, headlessWorkspace );


  var inline = Blockly.ClojureScript.workspaceToCode(headlessWorkspace);
  headlessWorkspace.dispose();
  var code = inline;

  return code;
}



// --------------------------------------------------------------------
//                      function getBlocklyOptimizedValue
//
//  input:        none
//  output:       the clojurescript code represented by blockly with no
//                macros
//  dependencies: The global blockly workspace
//
// --------------------------------------------------------------------
function getBlocklyOptimizedValue()
{

  var dom = Blockly.Xml.workspaceToDom(workspace);
  var headlessWorkspace = new Blockly.Workspace();
  rearrangeDom(dom);
  Blockly.Xml.domToWorkspace(dom, headlessWorkspace );


  var inline = Blockly.ClojureScriptOptimized.workspaceToCode(headlessWorkspace);
  headlessWorkspace.dispose();
  var code = inline;

  return code;
}






// --------------------------------------------------------------------
//                      function getBlocklyValueOptimized
//
//  input:        none
//  output:       the clojurescript code represented by blockly with no
//                macros
//  dependencies: The global blockly workspace
//
// --------------------------------------------------------------------
function getBlocklyValueOptimized()
{

  var dom = Blockly.Xml.workspaceToDom(workspace);
  var headlessWorkspace = new Blockly.Workspace();
  rearrangeDom(dom);
  Blockly.Xml.domToWorkspace(dom, headlessWorkspace);


  var inline = Blockly.ClojureScriptOptimized.workspaceToCode(headlessWorkspace);
  headlessWorkspace.dispose();
  var code = inline;
  //console.log(code);
  return code;
}






function setNonDBBlocksToReadOnly() {

  //
  // Save the names of all the custom components
  //
  var dom = Blockly.Xml.workspaceToDom(workspace);
  var blocks = dom.children;
  bc = blocks.length;
  for (i = bc - 1; i  >= 0; i--) {
    blocks = dom.children;
    console.log("Block= " + blocks[i].getAttribute('type'));
    if (!(blocks[i].getAttribute('type').startsWith('appshare_definedb_'))) {
      blocks[i].setAttribute('deletable', 'false');
      blocks[i].setAttribute('movable', 'false');
      //blocks[i].setAttribute('editable', 'false');
    };
  };
  Blockly.Blocks['appshare_definedb_table'].setcolor = function() {
    this.setColour(60);
  };
  Blockly.Blocks['appshare_definedb_column'].setcolor = function() {
    this.setColour(60);
  };
setCatchChanges(false);
  Blockly.mainWorkspace.clear();
  Blockly.Xml.domToWorkspace(dom, workspace);
setCatchChanges(true);
};



  function setAllBlocksToEditable(xxx) {

  //
  // Save the names of all the custom components
  //
  var dom = Blockly.Xml.workspaceToDom(workspace);
  var blocks = dom.children;
  bc = blocks.length;
  for (i = bc - 1; i  >= 0; i--) {
    blocks = dom.children;
    console.log("Block= " + blocks[i].getAttribute('type'));
      blocks[i].setAttribute('deletable', 'true');
      blocks[i].setAttribute('movable', 'true');
      //blocks[i].setAttribute('editable', 'false');
  };
  Blockly.Blocks['appshare_definedb_table'].setcolor = function() {
    this.setColour(230);
  };
  Blockly.Blocks['appshare_definedb_column'].setcolor = function() {
    this.setColour(230);
  };
setCatchChanges(false);
  Blockly.mainWorkspace.clear();
  Blockly.Xml.domToWorkspace(dom, workspace);
setCatchChanges(true);
};




// --------------------------------------------------------------------
//                        PROCESS BLOCKLY EVENTS
//
//                      function myChangeFunction
//
//  input:        a blockly event
//  output:       ??
//  dependencies: The global blockly workspace
//
// --------------------------------------------------------------------
gg= 1;
catchChanges = false;
function setCatchChanges(newvalue) {
  if (newvalue) {
    setTimeout(function(e) {catchChanges = newvalue;}, 500);
  } else {
    catchChanges = newvalue;
  };
};

function myChangeFunction(event) {
  if (!catchChanges) {
    return;
  };
  console.log("Event.type= " + event.type + " : " + event.oldValue  + " : " + event.newValue + " : " + event.name + " : " + event.blockId + " : " + event.xml);

  var blockaa = workspace.getBlockById(event.blockId);
  console.log("block.type= " + blockaa.type + " : " + event.oldValue  + " : " + event.newValue + " : " + event.name + " : " + event.blockId + " : " + event.xml);

  if (event.xml) {
    gg = event.xml;
    allfields = gg.getElementsByTagName("field");
    console.log("All XML: " ,gg);
  };


  if (blockaa.type.startsWith("appshare_definedb_")) {
    if (!myappshare.mainapp.get_edit_database_mode()) {
      myappshare.mainapp.set_edit_database_mode(true);
      setNonDBBlocksToReadOnly();
    };
    if (myappshare.mainapp.table_block_exists(event.blockId)) {
      myappshare.mainapp.set_new_table_name( event.blockId, event.newValue );
    }
    else {
      myappshare.mainapp.set_old_table_name( event.blockId, event.oldValue );
    }
  } else if (event.name == "COLUMNNAME") {
    var bblock = workspace.getBlockById(event.blockId);
    var prbl = bblock.getParent();
    var tablename = prbl.getFieldValue('TABLENAME');
    console.log("    column: " +   event.newValue + " :parent id:" + prbl.id + " :parent name:" + tablename);
    if (myappshare.mainapp.table_block_exists(prbl.id)) {
    }
    else {
      myappshare.mainapp.set_new_table_name( prbl.id, tablename );
    }


    if (myappshare.mainapp.column_block_exists(prbl.id ,  event.blockId)) {
      myappshare.mainapp.set_new_column_name(  prbl.id, event.blockId, event.newValue );
    }
    else {
      myappshare.mainapp.set_old_column_name(  prbl.id, event.blockId, event.oldValue );
    }

  };

  if ((event.type == Blockly.Events.CHANGE) &&
      (event.oldValue != event.newValue)) {
    if ((lastkeypresstime == -1) || ((new Date().getTime() - lastkeypresstime) < savelagtime)) {
      updateblockly = false;
    } else {
      updateblockly = true;
    };

    keypressed = true;

    lastkeypresstime = new Date().getTime();
    return;}



  if (event.type == 'ui') {return;}
  inEval = myappshare.mainapp.inEval();
  if (inEval) {return;}
  calcEvals = myappshare.mainapp.calcEvals();
  //console.log("Event.type= " + event.type + " : " + calcEvals);
  if (calcEvals == lastEval) {return;}

  lastEval = calcEvals;


  updateblockly = true;

}




      function myUpdateFunction() {


        if ((!updateblockly) && keypressed && ((new Date().getTime() - lastkeypresstime) > savelagtime)) {
          keypressed = false;
          updateblockly = true;
        };

        if (updateblockly) {
          var code = getBlocklyValue();

          document.getElementById('blocklyCode').innerHTML = getBlocklyOptimizedValue();//code;
          document.getElementById('blocklyCode2').innerHTML = getBlocklyXml15();
          document.getElementById('blocklyCode3').innerHTML = getBlocklyXml35();
          document.getElementById('numberOfEvals').innerHTML = '' + calcEvals;
          //uuuttt(toolbox);
          myappshare.mainapp.refreshapp();
          updateblockly = false;

          //console.log("Event.type= " + event.type + " : " + calcEvals);
        }
      }

      setInterval(myUpdateFunction, 1000);


      function getBlocklyXml()
      {
        var xml = Blockly.Xml.workspaceToDom(workspace);
        var code = Blockly.Xml.domToText(xml);
        //var code = Blockly.Xml.domToPrettyText(xml);
        return code;
      }


      function getBlocklyXml15()
      {
        var xml = Blockly.Xml.workspaceToDom(workspace);
        var code = Blockly.Xml.domToText(xml);
        //var code = Blockly.Xml.domToPrettyText(xml);
        return escapeHtml(formatXml(code));
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
        Blockly.Xml.domToWorkspace(dom,headlessWorkspace);


        var inline = Blockly.ClojureScript.workspaceToCode(headlessWorkspace);
        var dom = Blockly.Xml.workspaceToDom(headlessWorkspace);
        headlessWorkspace.dispose();
        var code = Blockly.Xml.domToText(dom);
        //var code = Blockly.Xml.domToPrettyText(xml);
        return code;
      }

      function getBlocklyXml35()
      {

        var dom = Blockly.Xml.workspaceToDom(workspace);
        var headlessWorkspace = new Blockly.Workspace();
        rearrangeDom(dom);
        Blockly.Xml.domToWorkspace(dom,headlessWorkspace);


        var inline = Blockly.ClojureScript.workspaceToCode(headlessWorkspace);
        var dom = Blockly.Xml.workspaceToDom(headlessWorkspace);
        headlessWorkspace.dispose();
        var code = Blockly.Xml.domToText(dom);
        //var code = Blockly.Xml.domToPrettyText(xml);
        return escapeHtml(formatXml(code));
      }

      function setBlocklyXml(xml_text)
      {
setCatchChanges(false);
        Blockly.mainWorkspace.clear();
        var xml = Blockly.Xml.textToDom(xml_text);
        Blockly.Xml.domToWorkspace(xml, workspace);
        centerBlocks();
setCatchChanges(true);
      }


      function initBlockly() {
        myappshare.mainapp.reset_table_defn_changes();

        workspace = Blockly.inject('blocklyDiv',
                                   {toolbox: toolbox,
                                   scrollbars: true,
                                    zoom:
         {controls: true,
          wheel: true,
          startScale: 0.7,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
                                    grid:
                                    {spacing: 20,
                                     length: 3,
                                     colour: '#ccc',
                                     snap: true},
                                   css: true});
        workspace.addChangeListener(myChangeFunction);
        Blockly.fireUiEvent(window, 'resize')
        workspace.updateToolbox(toolbox);


        //headlessWorkspace = new Blockly.Workspace();

      }


      function uuuttt(ttt) {
        workspace.updateToolbox(ttt);
      }

      function refreshBlockly() {
setCatchChanges(false);
  var xml = Blockly.Xml.workspaceToDom(workspace);
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(xml, workspace);
setCatchChanges(true);
      }

      function clearBlockly() {
setCatchChanges(false);
        Blockly.mainWorkspace.clear();
setCatchChanges(true);
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



