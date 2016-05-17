'use strict';

goog.provide('Blockly.Blocks.appshare');

goog.require('Blockly.Blocks');



Blockly.Blocks['appshare_samples_helloworld'] = {
  init: function() {
    this.appendDummyInput().appendField("Hello World");
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);

}
};

Blockly.Blocks['appshare_app'] = {
  init: function() {
    this.appendDummyInput().appendField("Appshare Application");
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput().appendField("");
    this.appendDummyInput().appendField("Main Application Element");
    this.appendStatementInput("main application element").setCheck("UiComponent");

    this.appendDummyInput().appendField("");
    this.appendDummyInput().appendField("Optional Application Elements");
    this.appendStatementInput("application elements").setCheck("ApplicationElement");
}
};



Blockly.Blocks['appshare_ui_component'] = {
  init: function() {
    this.appendDummyInput().appendField("UI component");
    this.setColour(130);
    this.appendDummyInput().appendField("");
    this.appendDummyInput().appendField("Main Div");
    this.appendStatementInput("main div element").setCheck("HtmlElement");
    //this.setOutput(true, 'UiComponent')
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  }
};







Blockly.Blocks['appshare_div'] = {
  init: function() {
    this.appendDummyInput().appendField("<div");
    this.appendValueInput("ATTRIBUTES").setCheck("HtmlElementAttribute");
    this.appendDummyInput().appendField(">");
    this.appendStatementInput("more elements").setCheck("HtmlElement");
    this.appendDummyInput().appendField("</div>");
    this.setInputsInline(true);

    this.setPreviousStatement(true, "HtmlElement");
    this.setNextStatement(true, "HtmlElement");
    this.setColour(130);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};



Blockly.Blocks['appshare_no_attributes'] = {
  init: function() {
    this.appendDummyInput().appendField("no attributes");
    this.setInputsInline(true);

    this.setColour(150);
    this.setTooltip('');
    this.setOutput(true, 'HtmlElementAttribute')
    this.setHelpUrl('http://www.example.com/');
  }
};



Blockly.Blocks['appshare_element_attribute'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("style"), "style")
        .appendField("=")
        .appendField(new Blockly.FieldTextInput("width=100%"), "value");

    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, "HtmlElementAttribute");
    this.setNextStatement(true, "HtmlElementAttribute");
    this.setOutput(true, 'HtmlElementAttribute')
    this.setColour(230);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};




Blockly.Blocks['appshare_element_text'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("text")
        .appendField(new Blockly.FieldTextInput("Type text here"), "VALUE");

    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, "HtmlElement");
    this.setNextStatement(true, "HtmlElement");
    this.setColour(230);
    this.setTooltip('');
    //this.setOutput(true, 'HtmlElement')
    this.setHelpUrl('http://www.example.com/');
  }
};





