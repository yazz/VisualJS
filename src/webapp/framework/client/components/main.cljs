(ns webapp.framework.client.components.main
  (:require
   [webapp.framework.client.coreclient   :as c ])
  (:use-macros
    [webapp.framework.client.coreclient  :only [ns-coils defn-ui-component def-coils-app
                                                container  map-many  inline  text
                                                div img pre component h2 input
                                                write-ui read-ui container input component <--
                                                h1 h2 h3 h4 h5 h6 span  data-view-v2 select
                                                ]]))



(ns-coils 'webapp.framework.client.components.main)


(defn-ui-component     cc2   [app]
                         {}

                         (div nil
                              (h2 nil "Coils")
                                (select id, item from todo_items where item like '%'
                                          {}
                                        (container
                                            (inline  "10%" (str (<-- :id)))
                                            (inline  "90%" (str (<-- :item)))))
                                "Build database webapps with Clojure"))


(def-coils-app     main-view   cc2)
