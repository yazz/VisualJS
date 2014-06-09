(ns webapp.client.components.usermain
  (:require
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
)

  (:use
   [webapp.client.components.forms               :only  [request-form]]
   [webapp.client.components.connection-graph    :only  [graph]]
   ))







(defn select-browser [e app]
  (om/update! app [:ui :tab]  "browser"))

(defn select-request [e app]
  (om/update! app [:ui :tab]  "request"))

(defn ^:export main [app owner state]
  (dom/div nil
           (dom/h2 nil "ConnectToUs.co")



           (dom/ul
            #js {:className  "nav nav-tabs"}

            (dom/li #js {:className  (if (= (-> app :ui :tab) "browser") "active" "")   }
                    (dom/a #js {:className  ""
                                :onClick        (fn[e] (select-browser e app))
                                :onTouchStart   (fn[e] (select-browser e app))

                                } "Graph")
                    )
            (dom/li #js {:className  (if (= (-> app :ui :tab) "request") "active" "") }
                    (dom/a #js {:className  ""
                                :onClick        (fn[e] (select-request e app))
                                :onTouchStart   (fn[e] (select-request e app))


                                } "Request")
                    )

            )

           (cond
            (= (-> app :ui :tab) "request")
            (om/build  request-form
                       {
                        :request (-> app :ui :request)
                        :data    (:data    app)
                        })


            (= (-> app :ui :tab) "browser")
            (cond

             ;(= (-> app :ui :graph-ab-test) "text")
             true
             (apply dom/div nil
                      (map
                       (fn[x] (dom/div nil
                                       (dom/div
                                        #js {
                                             :style
                                             #js {
                                                  :width "200px"
                                                  :display "inline-block"}}
                                        (get x "company"))
                                       (dom/span nil (get x "inbound"))
                         ))
                       (-> app :ui :companies))
                      )

             (= (-> app :ui :graph-ab-test) "SVG")
             (om/build  graph
                        {
                         :data    (:data    app)
                         }))

            )
           ))
