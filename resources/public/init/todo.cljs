(defn-ui-component     new-do-item-component   [app] {}
(input-field {:style {:marginBottom "20px"} :placeholder  "Enter a new todo here"}
app
(fn [new-todo-item-text]
(sql "insert into appshare_todo_items (item, item_status) values (?, ?)"
  [new-todo-item-text  "ACTIVE"]  )
 )))


(defn-ui-component     to-do-list-component   [app] {}
  (realtime select
  id, item, item_status
  from
  appshare_todo_items
 where
   item_status = ? OR item_status = ?
 order
  by id desc

   {:params [(if (read-ui app [:show]) (read-ui app [:show]) "ACTIVE")
    (if (read-ui app [:show]) (read-ui app [:show]) "COMPLETED")]}

(container

   (div {:className  "checkbox"  :style { :top "-22px" :width "20%" :display "inline-block;"} }
 (input {:type  "checkbox"
 :checked   (if (= (<-- :item_status) "COMPLETED") "T" "")
 :onChange  (fn [event]
 (let [newtext   (.. event -target -checked  )
   item-id   (<-- :id)]
    (if newtext
     (sql "update  appshare_todo_items   set item_status = 'COMPLETED' where id = ?" [item-id]  )
  (sql "update  appshare_todo_items   set item_status = 'ACTIVE' where id = ?" [item-id]  ))))}))

   (label {:style {:width   "70%" :height "1.5em"}
   :className (if (= (<-- :item_status) "COMPLETED") "completed" "item")}
   (str (<-- :item)))

  (button {:className    "destroy"
    :style       {:width   "10%"}
     :onClick     (fn [e]
     (sql "delete from  appshare_todo_items  where id = ?"
 [(<-- :id)]  )
false)}))))








(defn-ui-component     to-do-footer-component   [app] {}

  (let [active-items      (select id from  appshare_todo_items where item_status = 'ACTIVE' {})
        total-items       (select id from  appshare_todo_items {})
        completed-items   (select id from  appshare_todo_items where item_status = 'COMPLETED' {})  ]

    (if (pos? (count total-items))
      (do
        (div {:style {:height "30px"}})
        (div {:id "footer" :style {:backgroundColor "white" :fontSize "12"}}
             (container
               (div {:style {:width "27%" :display "inline-block;" :textAlign "left"}
                     }  (str (count active-items) " items left"))

               (button {:style {:width "9%" :border (str (if (nil? (read-ui app [:show])) "1px solid"))}
                        :onClick #(do (write-ui app [:show] nil) false)
                        } "ALL")

               (button {:style {:width "13%" :border (str (if (= "ACTIVE" (read-ui app [:show])) "1px solid"))}
                        :onClick #(do (write-ui app [:show] "ACTIVE") false)
                        } "Active")

               (button {:style {:width "17%" :border (str (if (= "COMPLETED" (read-ui app [:show])) "1px solid"))}
                        :onClick #(do (write-ui app [:show] "COMPLETED") false)
                        } "Completed")

               (if (pos? (count completed-items))
                 (button {:style {  :width "34%" :textAlign "right"}
                          :onClick #(do
                                          (sql "delete from  appshare_todo_items  where item_status = 'COMPLETED'" []  )
                                      false)
                          } "Clear completed"))))))))











(defn-ui-component     main   [app] {}

  (section {:className "todoapp" :style {:fontFamily "Roboto"}}
    (div {} (h2 {:style {:fontFamily "Ubuntu" :fontWeight "700" :fontSize "2em"}} (str "Todo MVC"  )))
    (div {:className "main_div"}

         (component  new-do-item-component   app  [])
         (div {:className "smallGap"})

         (component  to-do-list-component   app  [])
         (div {:className "mediumGap"})

         (component  to-do-footer-component   app  [])
         (div {:className "mediumGap"})

)))
