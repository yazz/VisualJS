'use strict';

goog.provide('Blockly.ClojureScript.appshare');

goog.require('Blockly.ClojureScript');







Blockly.ClojureScript['appshare_app'] = function(block) {
  var main_app = Blockly.ClojureScript.statementToCode(block, 'main application element');
  var textval = block.getFieldValue('VALUE') ;
  var code = '(defn-ui-component     main   [app] {}\n\
       (div   nil  ' + main_app + ' \"' + textval + '"\n\
    ))';
  return code;
};






Blockly.ClojureScript['appshare_ui_component'] = function(block) {
  var main_div = Blockly.ClojureScript.statementToCode(block, 'main div element');
  var code = '(defn-ui-component     main   [app] {}\r\n   (div   nil  \r\n' + main_div + '))\r\n';
  return code;
};







Blockly.ClojureScript['appshare_div'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = Blockly.ClojureScript.statementToCode(block, 'ATTRIBUTES');


  var statements_more_elements = Blockly.ClojureScript.statementToCode(block, 'more elements');

  var code = '(div ' + value_attributes + ' ' +
      statements_more_elements +
      ')\n' ;
  return code;
};



Blockly.ClojureScript['appshare_element_attribute'] = function(block) {
  return "{:style {:" + block.getFieldValue('style') + ' \"' + block.getFieldValue('value') + "\"}}";
};



Blockly.ClojureScript['appshare_no_attributes'] = function(block) {
  return "nil";
};



Blockly.ClojureScript['appshare_element_text'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = ''   + block.getFieldValue('VALUE')


  var code = '"' + value_attributes + '"' + '\n' ;

  return code;
};




Blockly.ClojureScript['appshare_element_header'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = ''   + block.getFieldValue('VALUE')


  var code = '(div {:style {:fontSize "3em" :display "inline-block"}} "' + value_attributes + '"' + ')\n' ;

  return code;
};







Blockly.ClojureScript['appshare_element_br'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = '(div nil "")' ;

  return code;
};



Blockly.ClojureScript['appshare_element_box'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = '(div {:style {:border "1px solid black" :width "200px" :height "200px" :display "inline-block"}} "")' ;

  return code;
};


Blockly.ClojureScript['appshare_element_padding'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = '(div {:style {:padding "10px" :display "inline-block"}} "")' ;

  return code;
};
