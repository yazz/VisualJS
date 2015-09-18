(ns webapp.framework.client.components.main_view
  (:require
   [webapp.framework.client.coreclient   :as c ])
  (:use-macros
    [webapp.framework.client.coreclient  :only [ns-coils defn-ui-component def-coils-app
                                                container  map-many  inline  text log sql
                                                div img pre component h2 input section
                                                write-ui read-ui container input component <--
                                                h1 h2 h3 h4 h5 h6 span  data-view-v2 select select-debug realtime realtime-debug
                                                ]])
  (:require-macros
    [cljs.core.async.macros :refer [go alt!]])
)



(ns-coils 'webapp.framework.client.components.main_view)


(defn-ui-component     cc2   [app]
                       {}

                       (section {:id "todoapp" :style {:padding "20px"}}
                              (h2 nil "Todo app")
                             (div {:style {:padding "20px" :backgoundColor "white"}}
                              (input {
                              :id "new_todo_item"
                              :className "newTodo"
                              :value (read-ui  app [:newitem2])

                              :onChange (fn [event2]
                                            (let [newtext      (.. event2 -target -value  )]
                                                  (write-ui  app  [:newitem2]  newtext)))

                              :onKeyDown  (fn [e]
                                             (do
                                                   (if (= (.-keyCode e  ) 13)
                                                             (go
                                                                 ;(js/alert (read-ui  app [:newitem2]))
                                                                 ;(log "ISERT :** "  newtext)

                                                                 (log (pr-str (sql "insert into  todo_items   (item) values (?)"
                                                                 [(read-ui  app [:newitem2])]  )))
                                                                 (write-ui  app  [:newitem2]  "")
                                                        ))))

                              })
                                (realtime select id, item from todo_items
                                          {}
                                        (container
                                            (inline  "10%" (str (<-- :id)))
                                            (inline  "90%" (str (<-- :item)))))

                                  (div {:style {:padding "20px" :backgoundColor "white"}})


                                  ( select-debug id, item from todo_items
                                          {}
                                          (container
                                            (inline  "10%" (str (<-- :id)))
                                            (inline  "90%" (str (<-- :item)))))

                                  (div {:style {:padding "20px" :backgoundColor "white"}})

                                  (realtime select id,item from todo_items  where id > 43
                                                  {}
                                                  (container
                                                    (inline  "10%" (str (<-- :id)))
                                                    (inline  "90%" (str (<-- :item)))))


                                  (div {:style {:padding "20px" :backgoundColor "white"}})


                                  (realtime select id,user_name from users
                                                  {}
                                                  (container
                                                    (inline  "10%" (str (<-- :id)))
                                                    (inline  "90%" (str (<-- :user_name)))))

                                  (div {:style {:padding "20px" :backgoundColor "white"}})

                                  ( realtime-debug select id, item from todo_items where id < 43
                                          {}
                                          (container
                                            (inline  "10%" (str (<-- :id)))
                                            (inline  "90%" (str (<-- :item)))))



                                  (div {:style {:padding "20px" :backgoundColor "white"}})






                              (div {:style {:height "30px"}})
                              (div {:id "footer" :style {:backgroundColor "white"}})
                             )))


(def-coils-app     main-view   cc2)

