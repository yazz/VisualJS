(ns webapp.framework.client.components.main
  (:require
   [webapp.framework.client.coreclient   :as c ])
  (:use-macros
    [webapp.framework.client.coreclient  :only [ns-coils sql log neo4j neo4j-1 sql-1 log
                                                watch-data  -->ui  <--data <--ui
                                                watch-ui
                                               remote  defn-ui-component
                                                container  map-many  inline  text
                                                div   img pre
                                                component h2 input
                                                write-ui read-ui container
                                                inline text admin
                                                ==data
                                                ==ui  -->ui  watch-ui <--ui
                                                <--data -->data
                                                remote
                                                input
                                                component <--
                                                h1 h2 h3 h4 h5 h6
                                                span  data-view-v2
                                                watch-data map-many inline text
                                                container <--pos <--id
                                                session-user-id select select-debug
                                                ]]))



(ns-coils 'webapp.framework.client.components.main)


(defn-ui-component     cc2   [app]
                         {}

                         (div nil
                                (select id, item from todo_items where item like '%'
                                          {}
                                        (div {:style {:paddingBottom "20px"}}
                                            (div {} (str (<-- :id)))
                                             (div {} (str (<-- :item)))
                                             )
                                        )
                                "Build database webapps with Clojure"))



(defn-ui-component     main-view   [app]
  {}

  (div nil
       (h2 nil "Coils")
         (component cc2  app  [])
       ""))