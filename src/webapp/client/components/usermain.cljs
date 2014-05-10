(ns webapp.client.components.usermain
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]]
   [om-sync.core     :as async]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [ankha.core       :as ankha])

  (:use
   [webapp.framework.client.coreclient      :only  [log remote]]
   [webapp.framework.client.system-globals  :only  [app-state   playback-app-state
                                                    playback-controls-state]]
   [webapp.client.components.forms               :only  [request-form]]
   [webapp.client.components.connection-graph    :only  [graph]]
   )
  (:use-macros
   [webapp.framework.client.neo4j      :only  [neo4j]]
   )
  (:require-macros
   [cljs.core.async.macros :refer [go]]))


(defn main [app owner state]
  (dom/div nil
           (dom/h2 nil "ConnectToUs.co")

           (om/build request-form {
                                   :request (-> app :ui :request)
                                   :data    (:data    app)
                                   }
                     )
           (om/build graph{
                           :data    (:data    app)
                           }
                     )

           ))
