(ns webapp.framework.client.components.main
  (:require
   [webapp.framework.client.coreclient   :as c ])
  (:use-macros
    [webapp.framework.client.coreclient  :only [ns-coils defn-ui-component def-coils-app
                                                container  map-many  inline  text log sql
                                                div img pre component h2 input section
                                                write-ui read-ui container input component <--
                                                h1 h2 h3 h4 h5 h6 span  data-view-v2 select select-debug
                                                ]])
  (:require-macros
    [cljs.core.async.macros :refer [go alt!]])
)



(ns-coils 'webapp.framework.client.components.main)


(defn-ui-component     cc2   [app]
                       {}

                       (section {:id "todoapp" :style {:padding "20px"}}
                              (h2 nil "todos")
                             (div {:style {:padding "20px" :backgoundColor "white"}}
                              (input {:className "newTodo"})
                                (select id, item from todo_items
                                          {}
                                        (container
                                            (inline  "10%" (str (<-- :id)))
                                            (inline  "90%" (str (<-- :item)))))

                                  (div {:style {:padding "20px" :backgoundColor "white"}})


                                  (select-debug id, item from todo_items
                                          {}
                                          (container
                                            (inline  "10%" (str (<-- :id)))
                                            (inline  "90%" (str (<-- :item)))))



                                  (div {:style {:padding "20px" :backgoundColor "white"}})






                              (div {:style {:height "30px"}})
                              (div {:id "footer" :style {:backgroundColor "white"}})
                              )))


(def-coils-app     main-view   cc2)


(go
  (log "SQL: " (select id ,item from todo_items   []  ))
)
