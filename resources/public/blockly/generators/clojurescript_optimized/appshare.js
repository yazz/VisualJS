'use strict';

goog.provide('Blockly.ClojureScriptOptimized.appshare');

goog.require('Blockly.ClojureScriptOptimizedOptimized');







Blockly.ClojureScriptOptimized['appshare_app'] = function(block) {
  var main_app = Blockly.ClojureScriptOptimized.statementToCode(block, 'main application element');
  var textval = block.getFieldValue('VALUE') ;
  var code = '(defn-ui-component     main   [app] {}\n\
       (div   nil  ' + main_app + ' \"' + textval + '"\n\
    ))  ';
  return code;
};






Blockly.ClojureScriptOptimized['appshare_ui_component'] = function(block) {
  var main_div = Blockly.ClojureScriptOptimized.statementToCode(block, 'main div element');
  var code = '(defn main [app  owner]                                                          \n\
    (reify                                                                                      \n\
          om.core/IRender                                                                       \n\
          (render [this]                                                                        \n\
                                                                                                \n\
                    (let [                                                                      \n\
                            ui-state   app                                                     \n\
                            path       (om.core/get-state owner :parent-path)                     \n\
                                                                                                \n\
                            return-val (webapp.framework.client.coreclient/debug-react          \n\
                                          "main"                                                \n\
                                          owner                                                 \n\
                                          app                                                  \n\
                                          (fn [app]                                            \n\
                                                (om.dom/div nil ' + main_div + '))               \n\
                                          path                                                   \n\
                                          )                                                    \n\
                            ]                                                                   \n\
                      return-val))))';

  return code;
};







Blockly.ClojureScriptOptimized['appshare_div'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = Blockly.ClojureScriptOptimized.statementToCode(block, 'ATTRIBUTES');


  var statements_more_elements = Blockly.ClojureScriptOptimized.statementToCode(block, 'more elements');

  var code = ' (om.dom/div  nil ' + value_attributes + ' ' +
      statements_more_elements +
      ') n' ;
  return code;
};



Blockly.ClojureScriptOptimized['appshare_element_attribute'] = function(block) {
  return " {:style {:" + block.getFieldValue('style') + ' \"' + block.getFieldValue('value') + "\"}} ";
};



Blockly.ClojureScriptOptimized['appshare_no_attributes'] = function(block) {
  return "nil";
};



Blockly.ClojureScriptOptimized['appshare_element_text'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = ''   + block.getFieldValue('VALUE')


  var code = '\n "' + value_attributes + '" ' + '\n' ;

  return code;
};




Blockly.ClojureScriptOptimized['appshare_element_header'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = ''   + block.getFieldValue('VALUE')


  var code = '(om.dom/div  (webapp.framework.client.coreclient/attrs  {:style {:fontSize "3em" :display "inline-block"}}) "' + value_attributes + '"' + ')\n' ;

  return code;
};







Blockly.ClojureScriptOptimized['appshare_element_br'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = ' (om.dom/div nil "") ' ;

  return code;
};



Blockly.ClojureScriptOptimized['appshare_element_box'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = ' (om.dom/div  (webapp.framework.client.coreclient/attrs {:style {:border "1px solid black" :width "200px" :height "200px" :display "inline-block"}}) "") ' ;

  return code;
};


Blockly.ClojureScriptOptimized['appshare_element_left_padding'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = ' (om.dom/div  (webapp.framework.client.coreclient/attrs  {:style {:padding "10px" :display "inline-block"}}) "") ' ;

  return code;
};





Blockly.ClojureScriptOptimized['appshare_element_top_padding'] = function(block) {
  // TODO: Assemble JavaScript into code variable.


  var code = ' (om.dom/div  (webapp.framework.client.coreclient/attrs  {:style {:padding "10px" }}) "") ' ;

  return code;
};


















Blockly.ClojureScriptOptimized['appshare_custom_component'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = ''   + block.getFieldValue('COMPONENT_NAME');
  var main_div = Blockly.ClojureScriptOptimized.statementToCode(block, 'main div element');
  var code = ' (defn ' + value_attributes +  ' [app  owner]                                      \n\
    (reify                                                                                      \n\
          om.core/IRender                                                                       \n\
          (render [this]                                                                        \n\
                                                                                                \n\
                    (let [                                                                      \n\
                            ui-state   app                                                      \n\
                            path       (om.core/get-state owner :parent-path)                   \n\
                                                                                                \n\
                            return-val (webapp.framework.client.coreclient/debug-react          \n\
                                          "main"                                                \n\
                                          owner                                                 \n\
                                          app                                                   \n\
                                          (fn [app]                                             \n\
                                                (om.dom/div nil ' + main_div + '))              \n\
                                          path                                                  \n\
                                          )                                                     \n\
                            ]                                                                   \n\
                      return-val)))) ';

  return code;
};

















Blockly.ClojureScriptOptimized['appshare_call_custom_component'] = function(block) {
  // TODO: Assemble JavaScript into code variable.

  var value_attributes = ''   + block.getFieldValue('COMPONENT_NAME_VALUE');
  var code = '(om.dom/div (webapp.framework.client.coreclient/attrs {:style {:display "inline-block"}}) (webapp.framework.client.coreclient/component-fn  ' + value_attributes + '  app     []   [])) ';
//code = '(om.dom/div nil " - ")';

  return code;
};


var tttt=0;


Blockly.ClojureScriptOptimized['appshare_db_component'] = function(block) {
  //var code = '(realtime select id, field1  from test {}  (<-- ))' ;
  //(sql-parser  "select" ~@select-args)
  var table_name = ''   + block.getFieldValue('VALUE');
  var field_names = ''   + block.getFieldValue('DB_FIELDS');
  var statements_more_elements = Blockly.ClojureScriptOptimized.statementToCode(block, 'more elements');

  tttt ++;
  var code = '(let                                                                                  \n\
                [relative-path-id2   (str (cljs-uuid-utils.core/make-random-uuid))                  \n\
                relative-path-id   ' + tttt + '                                                     \n\
                 data                                                                               \n\
                 (webapp.framework.client.coreclient/data-window-fn                                 \n\
                   (clojure.core/merge                                                              \n\
                     {:relative-path [relative-path-id]}                                            \n\
                     (if                                                                            \n\
                       select-id                                                                    \n\
                       (merge                                                                       \n\
                         {:fields [' + field_names + ' ],                                           \n\
                          :db-table "' + table_name +  '",                                          \n\
                          :relative-path [relative-path-id],                                        \n\
                          :params nil,                                                              \n\
                          :realtime true,                                                           \n\
                          :data-source :' + table_name +  '}                                        \n\
                         {:relative-path                                                            \n\
                          (conj                                                                     \n\
                            (conj                                                                   \n\
                              (get                                                                  \n\
                                {:fields [ ' + field_names + ' ],                                   \n\
                                 :db-table "' + table_name +  '",                                   \n\
                                 :relative-path [relative-path-id],                                 \n\
                                 :params nil,                                                       \n\
                                 :data-source :' + table_name +  '}                                 \n\
                                :relative-path)                                                     \n\
                              :values)                                                              \n\
                            select-id)})                                                            \n\
                       {:fields [ ' + field_names + ' ],                                            \n\
                        :db-table "' + table_name +  '",                                            \n\
                          :realtime true,                                                           \n\
                        :relative-path [relative-path-id],                                          \n\
                        :params nil,                                                                \n\
                        :data-source :' + table_name +  '}))                                        \n\
                   {:start 1, :end 20}                                                              \n\
                   ui-component-name                                                                \n\
                   path                                                                             \n\
                   ui-state)                                                                        \n\
                 data-order                                                                         \n\
                 (-> data :order)]                                                                  \n\
                                                                                                    \n\
  (om.dom/div                                                                                       \n\
    nil                                                                                             \n\
    (apply                                                                                          \n\
         om.dom/div nil                                                                             \n\
         (map                                                                                       \n\
     (fn [record-id]                                                                                \n\
                    (let                                                                            \n\
                      [relative-path                                                                \n\
                        (:relative-path                                                             \n\
                               (if                                                                  \n\
                                 select-id                                                          \n\
                                   (merge                                                           \n\
                                   {:fields [' + field_names + ' ],                                 \n\
                                    :db-table "' + table_name +  '",                                \n\
                          :realtime true,                                                           \n\
                                    :relative-path [relative-path-id],                              \n\
                                    :params nil,                                                    \n\
                                    :data-source :' + table_name +  '}                              \n\
                                   {:relative-path                                                  \n\
                                    (conj                                                           \n\
                                      (conj                                                         \n\
                                        (get                                                        \n\
                                          {:fields [' + field_names + ' ],                          \n\
                                           :db-table "' + table_name +  '",                         \n\
                                           :relative-path [relative-path-id],                       \n\
                                           :params nil,                                             \n\
                                           :data-source :' + table_name +  '}                       \n\
                                          :relative-path)                                           \n\
                                        :values)                                                    \n\
                                      select-id)})                                                  \n\
                  {:fields [' + field_names + ' ],                                                  \n\
                                  :db-table "' + table_name +  '",                                  \n\
                          :realtime true,                                                           \n\
                                  :relative-path [relative-path-id],                                \n\
                                  :params nil,                                                      \n\
                                  :data-source :' + table_name +  '}))                              \n\
                             record                                                                 \n\
                             (get (-> data :values) record-id)                                      \n\
                             select-id                                                              \n\
                             (get-in record [:value :id])]                                          \n\
                            (if (clojure.core/get record :value) (om.dom/div {} (om.dom/div nil     \n\
                             " " ' + statements_more_elements + '                                   \n\
                            )))))                                                                  \n\
      (map                                                                                          \n\
        (fn [x] (get data-order x))                                                                 \n\
        (range (:start {:start 1, :end 20})                                                         \n\
               (inc (min (:end {:start 1, :end 20}) (-> data :count))))))))) ';

  //console.log(code);
  return code;
};


Blockly.ClojureScriptOptimized['appshare_db_field'] = function(block) {
  var value_attributes = ''   + block.getFieldValue('VALUE');
  var code = ' (webapp.framework.client.coreclient/<---fn   record  :' + value_attributes +  '  path  relative-path  )   ' + ' ';
  return code;
};





Blockly.ClojureScriptOptimized['appshare_show_tables'] = function(block) {
  var code = ' (om.dom/div  nil                                                                                         \n\
                   (apply                                                                                               \n\
                         om.dom/div nil                                                                                 \n\
                         (map                                                                                           \n\
                             (fn [table-name]                                                                           \n\
                                 (om.dom/div nil (str table-name)))                                                     \n\
                            (get-in @webapp.framework.client.system-globals/app-state [:ui :table-list])                \n\
         ))) ';
  return code;
};








Blockly.ClojureScriptOptimized['appshare_input_field'] = function(block) {
  var placeholder     = block.getFieldValue('PLACEHOLDER');
  var value_callback  = Blockly.ClojureScriptOptimized.statementToCode(block, 'CALLBACK');
  var storein         = block.getFieldValue('STOREIN');

  var code = ' (om.dom/input                                                                                              \n\
                         (webapp.framework.client.coreclient/attrs {                                                      \n\
                              :onKeyDown     (fn [event]                                                                  \n\
                                                   (let [ ' + storein + '  (.. event -target -value  ) ]                  \n\
                                                      (if (= (.-keyCode event  ) 13)                                      \n\
                                                         (do ' +
                                                             value_callback + '                                           \n\
                                                              (set!  (.. event -target -value  ) ""  )                    \n\
                                                             nil ))))                                                     \n\
                              :style        {:marginBottom "20px"}                                                        \n\
                              :placeholder  "' + placeholder + '"                                                         \n\
                             }) "") ';
  return code;
};


Blockly.ClojureScriptOptimized['appshare_code_alert'] = function(block) {
  var text = ''   + block.getFieldValue('TEXT');
  var code = ' (js/alert (str  "' + text + '")) ';
  return code;
};



Blockly.ClojureScriptOptimized['appshare_code_raw'] = function(block) {
  var code = ''   + block.getFieldValue('CODE');
  return code;
};










Blockly.ClojureScriptOptimized['appshare_code_insert'] = function(block) {
  var tablename = block.getFieldValue('TABLENAME');
  var field = block.getFieldValue('FIELD');
  var value = block.getFieldValue('VALUE');
  var code = '(webapp.framework.client.coreclient/sql-callback (str "insert into ' +
      tablename + ' (' + field + ') values ( ? )") [' + value + '] (fn [xx] nil ))';
  //var code = '(webapp.framework.client.coreclient/sql-callback select id from todo_items {} (fn [xx] nil ))';
  return code;
};




Blockly.ClojureScriptOptimized['appshare_db_rowid_button'] = function(block) {
  var text = ''   + block.getFieldValue('TEXT');
  var callbackcode = Blockly.ClojureScriptOptimized.statementToCode(block, 'CALLBACK');

  var code = '(om.dom/button                                                                                                \n\
                            (webapp.framework.client.coreclient/attrs {                                                     \n\
                                   :type          "button"                                                                  \n\
                                   :className     "btn  btn-default"                                                        \n\
                                   :onClick       (fn [e]                                                                   \n\
                                                       (let [id    (webapp.framework.client.coreclient/<---fn               \n\
                                                                           record  :id  path  relative-path)]               \n\
                                                                               (do ' + callbackcode +  '  nil))) })         \n\
                            "' + text + '")';
  return code;
};



