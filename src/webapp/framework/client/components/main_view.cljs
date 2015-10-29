(ns webapp.framework.client.components.main_view
  (:require
   [webapp.framework.client.coreclient   :as c ])
  (:use-macros
   [webapp.framework.client.coreclient  :only [ns-coils defn-ui-component def-coils-app
                                               container  map-many  inline  text log sql
                                               div img pre component h2 input section header button
                                               write-ui read-ui container input component <-- data-view-result-set
                                               h1 h2 h3 h4 h5 h6 span  data-view-v2 select dselect realtime drealtime
                                               input-field
                                               ]])
  (:require-macros
   [cljs.core.async.macros :refer [go alt!]]))
(ns-coils 'webapp.framework.client.components.main_view)









(defn-ui-component     main-to-do-component   [app]
  {}

  (section {:id "todoapp"
            :style {:padding "20px" :width "550px"}}

           (header {} (h2 nil "Todo app"))

           (div { :width "100%"
                  :style {:padding "20px" :backgoundColor "white"}}


                (input-field {}
                 app
                 (fn [new-value]
                   (go
                    (sql "insert into  coils_todo_items   (item, item_status) values (?,?)"
                        [new-value  "ACTIVE"]  ))))


                (div {:style {:padding "10px" :backgoundColor "white"}})

                (realtime select
                                id, item, item_status
                          from
                                coils_todo_items
                          where
                                item_status = ?
                          OR
                                item_status = ?
                          order
                                by id desc

                          {:params [(if (read-ui app [:show]) (read-ui app [:show]) "ACTIVE")
                                    (if (read-ui app [:show]) (read-ui app [:show]) "COMPLETED")
                                    ]}
                          (container

                           (input {:className "toggle" 	:type "checkbox" :style {:width "20%"}
                                   :checked (if (= (<-- :item_status) "COMPLETED") "T" "")
                                   :onChange   (fn [event]
                                                 (let [newtext   (.. event -target -checked  )
                                                       item-id   (<-- :id)]
                                                   (if newtext
                                                     (go (sql "update  coils_todo_items   set item_status = 'COMPLETED' where id = ?" [item-id]  ))
                                                     (go (sql "update  coils_todo_items   set item_status = 'ACTIVE' where id = ?" [item-id]  ))
                                                   )))})

                           (div {:style {:width   "50%"} :className (if (= (<-- :item_status) "COMPLETED") "completed" "item")} (str (<-- :item)))
                           (button {:className   "destroy"
                                 :style {:width   "10%"}
                                 :onClick
                                 (fn [e]
                                   (go
                                    (sql "delete from  coils_todo_items  where id = ?"
                                         [(<-- :id)]  )))})
                            ))


                (div {:style {:padding "20px" :backgoundColor "white"}})




                (let [active-items      (select id from  coils_todo_items where item_status = 'ACTIVE' {})
                      total-items       (select id from  coils_todo_items {})
                      completed-items   (select id from  coils_todo_items where item_status = 'COMPLETED' {})
                      ]

                  (if (pos? (count total-items))
                    (do
                      (div {:style {:height "30px"}})
                      (div {:id "footer" :style {:backgroundColor "white" :fontSize "12"}}
                           (container
                            (div {:style { :width "32%" :display "inline-block;" :textAlign "left"}}  (str (count active-items) " items left"))

                            (button {:style { :width "12%" :border (str (if (nil? (read-ui app [:show])) "1px solid"))}
                                     :onClick (fn [e]
                                                (write-ui app [:show] nil)
                                                ) } "ALL")
                            (button {:style {  :width "12%" :border (str (if (= "ACTIVE" (read-ui app [:show])) "1px solid"))}
                                     :onClick (fn [e]
                                                (write-ui app [:show] "ACTIVE")
                                                ) } "Active")
                            (button {:style {  :width "12%" :border (str (if (= "COMPLETED" (read-ui app [:show])) "1px solid"))}
                                     :onClick (fn [e]
                                                (write-ui app [:show] "COMPLETED")
                                                ) } "Completed")

                            (if (pos? (count completed-items))
                              (button {:style {  :width "32%" :textAlign "right"}
                                       :onClick (fn [e]
                                                  (go
                                                   (sql "delete from  coils_todo_items  where item_status = 'COMPLETED'"
                                                        []  ))
                                                  ) } "Clear completed"))

                            ))))))))


(def-coils-app     main-view   main-to-do-component)

