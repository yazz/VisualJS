(ns webapp.framework.client.components.main_view
  (:require
   [webapp.framework.client.coreclient   :as c ])
  (:use-macros
   [webapp.framework.client.coreclient  :only [ns-coils defn-ui-component def-coils-app
                                               container  map-many  inline  text log sql
                                               div img pre component h2 input section
                                               write-ui read-ui container input component <-- data-view-result-set
                                               h1 h2 h3 h4 h5 h6 span  data-view-v2 select select-debug realtime realtime-debug
                                               ]])
  (:require-macros
   [cljs.core.async.macros :refer [go alt!]]))
(ns-coils 'webapp.framework.client.components.main_view)









(defn-ui-component     main-to-do-component   [app]
  {}

  (section {:id "todoapp"
            :style {:padding "20px" :width "100%"}}

           (h2 nil "Todo app")

           (div { :width "100%"
                  :style {:padding "20px" :backgoundColor "white"}}

                (input {
                        :id          "new_todo_item"
                        :className   "newTodo"
                        :value      (read-ui  app [:new-to-do-item])

                        :onChange
                        (fn [event]
                          (let [newtext      (.. event -target -value  )]
                            (write-ui  app  [:new-to-do-item]  newtext)))


                        :onKeyDown
                        (fn [event]
                          (do
                            (if (= (.-keyCode event  ) 13)
                              (go
                               (sql "insert into  coils_todo_items   (item) values (?)"
                                    [(read-ui  app [:new-to-do-item])]  )
                               (write-ui  app  [:new-to-do-item]  "")))))})



                (realtime select
                                id, item
                          from
                                coils_todo_items
                          order
                                by id desc
                          {}
                          (container
                           (inline  "10%" (str (<-- :id)))
                           (inline  "40%" (str (<-- :item))
                                    )))

                (div {:style {:padding "20px" :backgoundColor "white"}})




                (div {:style {:height "30px"}})
                (div {:id "footer" :style {:backgroundColor "white"}})
                )))


(def-coils-app     main-view   main-to-do-component)

