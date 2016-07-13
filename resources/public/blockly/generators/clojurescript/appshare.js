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


Blockly.ClojureScript['appshare_element_left_padding'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = '(div {:style {:padding "10px" :display "inline-block"}} "")' ;

  return code;
};





Blockly.ClojureScript['appshare_element_top_padding'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = '(div {:style {:padding "10px" }} "")' ;

  return code;
};







Blockly.ClojureScript['appshare_custom_component'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = ''   + block.getFieldValue('COMPONENT_NAME');
  var main_div = Blockly.ClojureScript.statementToCode(block, 'main div element');
  var code = '(defn-ui-component     ' + value_attributes +  '    [app] {} (div nil \r\n' + main_div + '))' ;

  return code;
};





Blockly.ClojureScript['appshare_call_custom_component'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = ''   + block.getFieldValue('COMPONENT_NAME_VALUE');
  var code = '(component  ' + value_attributes +  ' app   []  )' ;

  return code;
};




Blockly.ClojureScript['appshare_db_component'] = function(block) {
  //var statements_more_elements = Blockly.ClojureScript.statementToCode(block, 'more elements');
  var code = '(realtime select id, field1  from test {}  (<-- :field1))' ;

  return code;
};

Blockly.ClojureScript['appshare_db_field'] = function(block) {
  var value_attributes = ''   + block.getFieldValue('VALUE');
  var code = '(webapp.framework.client.coreclient/<---fn   record  :' + value_attributes +  '  path  relative-path  )';
  return code;
};




Blockly.ClojureScript['appshare_show_tables'] = function(block) {
  var code = '';
  return code;
};
