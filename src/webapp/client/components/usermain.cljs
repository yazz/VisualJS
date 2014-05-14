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

           (om/build  request-form
                      {
                       :request (-> app :ui :request)
                       :data    (:data    app)
                       })


           (comment om/build  graph
                      {
                       :data    (:data    app)
                       })

           ))
