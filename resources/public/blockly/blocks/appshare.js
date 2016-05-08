'use strict';

goog.provide('Blockly.Blocks.appshare');

goog.require('Blockly.Blocks');



//https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#3ggmju
Blockly.Blocks['appshare_app'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Applicaiton");
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};




//https://blockly-demo.appspot.com/static/demos/blockfactory/index.html#wphz2c
Blockly.Blocks['appshare_div'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("<div>");
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};
