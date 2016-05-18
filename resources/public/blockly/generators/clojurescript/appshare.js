'use strict';

goog.provide('Blockly.ClojureScript.appshare');

goog.require('Blockly.ClojureScript');




Blockly.ClojureScript['appshare_samples_helloworld'] = function(block) {
  var code = '\
  (defn-ui-component     main   [app] {}\n\
       (div   nil   "hello world"\n\
    ))';
  return code;
};



Blockly.ClojureScript['appshare_quick_app'] = function(block) {
  var textval = block.getFieldValue('VALUE') ;

  var code = '\
  (defn-ui-component     main   [app] {}\n\
       (div   nil   "' + textval + '"\n\
    ))';
  return code;
};






Blockly.ClojureScript['appshare_app'] = function(block) {
  var main_app = Blockly.ClojureScript.statementToCode(block, 'main application element');
  var code = main_app + '\n';
  return code;
};






Blockly.ClojureScript['appshare_ui_component'] = function(block) {
  var main_div = Blockly.ClojureScript.statementToCode(block, 'main div element');
  var code = '(defn-ui-component     main   [app] {}\r\n   ' + main_div + ')\r\n';
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
  return "{" + block.getFieldValue('style') + '=' + block.getFieldValue('value') + "}";
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
