
function myChangeFunction2(event) {
  //swapelements();
}






function swapelements() {
  inline = document.getElementById('other').style.display;
  if (inline == 'none') {
    code = getBlocklyValue();
    //document.getElementById('outputcode').innerHTML = code;
    //codeevaluation.store({code: code});
    console.log('Code: ' + code);

    document.getElementById('blocklyid').style.display = 'none';
    document.getElementById('other').style.display = 'block';

    //eval(code);
    //alert(code);
  } else {
    document.getElementById('blocklyid').style.display = 'block';
    document.getElementById('other').style.display = 'none';
  };
};




function resetzoom() {
  document.getElementById('zoommain').style.transform='';
  document.getElementById('body').style.transform='';
};





var onresize = function(e) {
  blocklyArea = document.getElementById('blocklyArea');
      blocklyDiv = document.getElementById('blocklyDiv');
  // Compute the absolute coordinates and dimensions of blocklyArea.
  var element = blocklyArea;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  // Position blocklyDiv over blocklyArea.
  blocklyDiv.style.left = x + 'px';
  blocklyDiv.style.top = y + 'px';
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
  blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';

};





function initBlockly() {

    blocklyArea = document.getElementById('blocklyArea');
      blocklyDiv = document.getElementById('blocklyDiv');
      workspace = Blockly.inject(blocklyDiv,
                                     {media: '../../media/',
                                      toolbox: document.getElementById('toolbox')});


      window.addEventListener('resize', onresize, false);
      onresize();
      Blockly.svgResize(workspace);


      workspace.addChangeListener(myChangeFunction2);
      setTimeout(function() {
        console.log('Closing blockly');
        document.getElementById('blocklyid').style.display = 'none';
        document.getElementById('blocklyid').style.left = '+500px';

      },100);
}
