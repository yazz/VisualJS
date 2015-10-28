(ns webapp.framework.client.components.main_view
  (:require
   [webapp.framework.client.coreclient   :as c ])
  (:use-macros
   [webapp.framework.client.coreclient  :only [ns-coils defn-ui-component def-coils-app
                                               container  map-many  inline  text log sql
                                               div img pre component h2 input section header
                                               write-ui read-ui container input component <-- data-view-result-set
                                               h1 h2 h3 h4 h5 h6 span  data-view-v2 select select-debug realtime realtime-debug
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
                    (sql "insert into  coils_todo_items   (item) values (?)"
                        [new-value]  ))))



                (realtime select
                                id, item
                          from
                                coils_todo_items
                          order
                                by id desc
                          {}
                          (container
                           (input {:className "toggle" :type "checkbox" :style {:width "20%"}})
                           (inline  "40%" (str (<-- :item)))
                           (div {:className   "destroy"
                                 :style {:width   "10%"}
                                 :onClick
                                 (fn [e]
                                   (go
                                    (sql "delete from  coils_todo_items  where id = ?"
                                         [(<-- :id)]  )))})))


                (div {:style {:padding "20px" :backgoundColor "white"}})




                (div {:style {:height "30px"}})
                (div {:id "footer" :style {:backgroundColor "white"}}
                     (let [items (select   id  from    coils_todo_items {}) ]
                     (container
                      (inline "100%" (str (count items) " items left"))
                      )
                     ))
                )))


(def-coils-app     main-view   main-to-do-component)

