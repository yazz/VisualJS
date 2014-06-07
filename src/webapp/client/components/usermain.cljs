(ns webapp.client.components.usermain
  (:require
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
)

  (:use
   [webapp.client.components.forms               :only  [request-form]]
   [webapp.client.components.connection-graph    :only  [graph]]
   ))









(defn ^:export main [app owner state]
  (dom/div nil
           (dom/h2 nil "ConnectToUs.co")



           (dom/ul
            #js {:className  "nav nav-tabs"}

            (dom/li #js {:className  (if (= (-> app :ui :tab) "browser") "active" "")   }
                    (dom/a #js {:className  ""
                                :onClick (fn [e]
                                  (om/update! app [:ui :tab]  "browser"))
                                } "Graph")
                    )
            (dom/li #js {:className  (if (= (-> app :ui :tab) "request") "active" "") }
                    (dom/a #js {:className  ""
                                :onClick (fn [e]
                                           (om/update! app [:ui :tab]  "request"))

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

             (= (-> app :ui :graph-ab-test) "text")
             (dom/div {} "Text")

             (= (-> app :ui :graph-ab-test) "SVG")
             (om/build  graph
                        {
                         :data    (:data    app)
                         }))

            )


           ))
