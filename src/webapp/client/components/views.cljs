(ns webapp.client.components.views
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
   [webapp.framework.client.coreclient           :only  [log remote]]
   [webapp.client.globals                        :only  [app-state   playback-app-state
                                                         playback-controls-state]]
   [webapp.client.components.forms               :only  [request-form]]
   [webapp.client.components.connection-graph    :only  [graph]]
   )
  (:use-macros
   [webapp.framework.client.neo4j      :only  [neo4j]]
   )
  (:require-macros
   [cljs.core.async.macros :refer [go]]))










(defn main-view [app owner]
  (reify

    ;---------------------------------------------------------
    om/IInitState
    (init-state [_]
                {
                   :delete            (chan)
                })
    ;---------------------------------------------------------





    ;---------------------------------------------------------
    om/IWillMount
    (will-mount [_]
                (let [delete (om/get-state owner :delete)]
                  (go (loop []
                        (let [contact (<! delete)]
                          (om/transact! app :contacts
                                        (fn [xs] (vec (remove #(= contact %) xs))))
                          (recur))))))
    ;---------------------------------------------------------




    ;---------------------------------------------------------
    om/IRenderState
    (render-state
     [this state]
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
    ;---------------------------------------------------------

))
