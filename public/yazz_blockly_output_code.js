'use strict';
goog.provide('Blockly.Yazz.appshare');
goog.require('Blockly.Yazz');





Blockly.Yazz['yazz_builder'] = function(block) {
  var element_to_watch = block.getFieldValue('element_to_watch') ;
  var field_to_watch = block.getFieldValue('field_to_watch') ;
  var conditions = Blockly.Yazz.statementToCode(block, 'search_code');
  var code_to_run = Blockly.Yazz.statementToCode(block, 'code_to_run');

  var code = "                                                                     \
  " + element_to_watch + "." + conditions  +
    "watch().subscribe(                                      \
    recs => {                                                                 \
" + code_to_run + " \
           } ,      \
    (err) =>                                                                       \
    {       console.log(err);     }                                                \
  );                                                                               \
  ;";
  return code;
};



Blockly.Yazz['yazz_search_expr'] = function(block) {
  var element_to_watch = block.getFieldValue('element_to_watch') ;
  var field_to_watch = block.getFieldValue('field_to_watch') ;
  var code_to_run = Blockly.Yazz.statementToCode(block, 'code_to_run');

  var code = "                                                                     \
  " + element_to_watch + ".watch().subscribe(                                      \
    recs => {                                                                 \
" + code_to_run + " \
           } ,      \
    (err) =>                                                                       \
    {       console.log(err);     }                                                \
  );                                                                               \
  ;";
  return code;
};



Blockly.Yazz['yazz_any_watcher'] = function(block) {
  var element_to_watch = block.getFieldValue('element_to_watch') ;
  var field_to_watch = block.getFieldValue('field_to_watch') ;
  var code_to_run = Blockly.Yazz.statementToCode(block, 'code_to_run');

  var code = "                                                                     \
  " + element_to_watch + ".watch().subscribe(                                      \
    recs => {                                                                 \
" + code_to_run + " \
           } ,      \
    (err) =>                                                                       \
    {       console.log(err);     }                                                \
  );                                                                               \
  ;";
  return code;
};







Blockly.Yazz['yazz_new_record'] = function(block) {
  var record_class = block.getFieldValue('record_class') ;
  var field_name_1 = block.getFieldValue('field_name_1') ;
  var field_value_1 = block.getFieldValue('field_value_1') ;
  var field_name_2 = block.getFieldValue('field_name_2') ;
  var field_value_2 = block.getFieldValue('field_value_2') ;
  code = "";
  code = code + "tags.store({tag: '" + record_class + "' ";
  if (field_name_1) {code = code + ", " + field_name_1 + ": " + field_value_1 + " ";};
  if (field_name_2) {code = code + ", " + field_name_2 + ": " + field_value_2 + " ";};
  code = code + "});";
  return code;
};









Blockly.Yazz['yazz_div'] = function(block) {
  var id = block.getFieldValue('ID') ;
  var textval = block.getFieldValue('VALUE') ;
  return "r.db('yazz').table('tags').insert({id: '" + id + "','text': '" + textval + "'}).run(conn);";
};








Blockly.Yazz['yazz_input'] = function(block) {
  var id = block.getFieldValue('ID') ;
  var textval = block.getFieldValue('VALUE') ;
  return "tags.store({tag: 'input' ,id: '" + id + "',text: '" + textval + "' , onclick: \'alert(1);\'});";
};





Blockly.Yazz['yazz_code'] = function(block) {
  var code = block.getFieldValue('VALUE') ;
  var field_to_watch = "seconds";
  return "tags.store({id: 'timediv', tag: 'div' ,text: 'time: ' + recs[0]." + field_to_watch + "});";
};



Blockly.Yazz['yazz_time_watcher'] = function(block) {
  var code = "                                                                     \
  times.watch().subscribe(                                                        \
    timesrecs => {                                                                 \
      tags.store({id: 'timediv', tag: 'div' ,text: 'time: ' + secs});     } ,      \
    (err) =>                                                                       \
    {       console.log(err);     }                                                \
  );                                                                               \
  ;";
  return code;
};








Blockly.Yazz['appshare_app'] = function(block) {
  var main_app = Blockly.Yazz.statementToCode(block, 'main application element');
  var textval = block.getFieldValue('VALUE') ;
  var code = '(defn-ui-component     main   [app] {}\n\
       (div   nil  ' + main_app + ' \"' + textval + '"\n\
    ))';
  return code;
};






Blockly.Yazz['appshare_ui_component'] = function(block) {
  var main_div = Blockly.Yazz.statementToCode(block, 'main div element');
  var code = '(defn-ui-component     main   [app] {}\r\n   (div   nil  \r\n' + main_div + '))\r\n';
  return code;
};







Blockly.Yazz['appshare_div'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = Blockly.Yazz.statementToCode(block, 'ATTRIBUTES');


  var statements_more_elements = Blockly.Yazz.statementToCode(block, 'more elements');

  var code = '(div ' + value_attributes + ' ' +
      statements_more_elements +
      ')\n' ;
  return code;
};



Blockly.Yazz['appshare_element_attribute'] = function(block) {
  return "{:style {:" + block.getFieldValue('style') + ' \"' + block.getFieldValue('value') + "\"}}";
};



Blockly.Yazz['appshare_no_attributes'] = function(block) {
  return "nil";
};



Blockly.Yazz['appshare_element_text'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = ''   + block.getFieldValue('VALUE')


  var code = '"' + value_attributes + '"' + '\n' ;

  return code;
};




Blockly.Yazz['appshare_element_header'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = ''   + block.getFieldValue('VALUE')


  var code = '(div {:style {:fontSize "3em" :display "inline-block"}} "' + value_attributes + '"' + ')\n' ;

  return code;
};







Blockly.Yazz['appshare_element_br'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = '(div nil "")' ;

  return code;
};



Blockly.Yazz['appshare_element_box'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = '(div {:style {:border "1px solid black" :width "200px" :height "200px" :display "inline-block"}} "")' ;

  return code;
};


Blockly.Yazz['appshare_element_left_padding'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = '(div {:style {:padding "10px" :display "inline-block"}} "")' ;

  return code;
};





Blockly.Yazz['appshare_element_top_padding'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = '(div {:style {:padding "10px" }} "")' ;

  return code;
};







Blockly.Yazz['appshare_custom_component'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = ''   + block.getFieldValue('COMPONENT_NAME');
  var main_div = Blockly.Yazz.statementToCode(block, 'main div element');
  var code = '(defn-ui-component     ' + value_attributes +  '    [app] {} (div nil \r\n' + main_div + '))' ;

  return code;
};





Blockly.Yazz['appshare_call_custom_component'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = ''   + block.getFieldValue('COMPONENT_NAME_VALUE');
  //var code = '(component  ' + value_attributes +  ' app   []  )' ;
  var code = '';

  return code;
};




Blockly.Yazz['appshare_db_component'] = function(block) {
  //var statements_more_elements = Blockly.Yazz.statementToCode(block, 'more elements');
  var code = '(realtime select id, field1  from test {}  (<-- :field1))' ;

  return code;
};

Blockly.Yazz['appshare_db_field'] = function(block) {
  var value_attributes = ''   + block.getFieldValue('VALUE');
  var code = '(webapp.framework.client.coreclient/<---fn   record  :' + value_attributes +  '  path  relative-path  )';
  return code;
};




Blockly.Yazz['appshare_show_tables'] = function(block) {
  var code = ' "" ';
  return code;
};






Blockly.Yazz['appshare_input_field'] = function(block) {
  var code = '';
  return code;
};


Blockly.Yazz['appshare_code_alert'] = function(block) {
  var code = ' (js/alert (str (.. event -target -value  ) " pressed2")) ';
  return code;
};


Blockly.Yazz['appshare_code_raw'] = function(block) {
  var code = ' (js/alert (str (.. event -target -value  ) " pressed2")) ';
  return code;
};






Blockly.Yazz['appshare_code_insert'] = function(block) {
  var code = ' (js/alert (str (.. event -target -value  ) " pressed2")) ';
  return code;
};






Blockly.Yazz['appshare_db_rowid_button'] = function(block) {
  var code = ' ';
  return code;
};




Blockly.Yazz['appshare_definedb_table'] = function(block) {
  var code = ' ';
  return code;
};





Blockly.Yazz['appshare_definedb_column'] = function(block) {
  var code = ' ';
  return code;
};






Blockly.Yazz['appshare_code_update_ddl'] = function(block) {
  var code = ' ';
  return code;
};





Blockly.Yazz['appshare_element_button'] = function(block) {
  var code = ' ';
  return code;
};

