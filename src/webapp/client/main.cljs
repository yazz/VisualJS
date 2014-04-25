(ns webapp.client.main
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
   [webapp.framework.client.coreclient :only  [log remote]]
   [webapp.client.globals              :only  [app-state   playback-app-state
                                               playback-controls-state
                                               reset-app-state]]
   [webapp.client.components.views     :only  [main-view]]
   [webapp.client.components.playback  :only  [playback-controls-view ]]
   )
  (:use-macros
   [webapp.framework.client.coreclient :only  [ns-coils]]
   [webapp.framework.client.neo4j      :only  [neo4j]]
   )
  (:require-macros
   [cljs.core.async.macros :refer [go]]))



(js/React.initializeTouchEvents  true)


(def history-order (atom 0))

(def start-time (.getTime (js/Date.)))

(def session-id (atom ""))

(go
 (let [session (:value (<! (remote "create-session" {})  ))]
   (log session)
   (reset! session-id session)))





(defn main []
  (do
    (reset-app-state)

    (om/root
     ankha/inspector
     app-state
     {:target (js/document.getElementById "example")})

    (let [
          tx-chan       (chan)
          tx-pub-chan   (pub tx-chan (fn [_] :txs))
          ]
          (om/root   main-view
                     app-state

                 {:target (. js/document (getElementById "main"))
                  :shared {:tx-chan tx-pub-chan}
                  :tx-listen
                  (fn [tx-data root-cursor]
                    (go
                     (log (str tx-data))
                     (put! tx-chan [tx-data root-cursor])

                     (<! (remote "add-history"
                                 {
                                  :session-id    @session-id
                                  :history-order @history-order
                                  :history       tx-data
                                  :timestamp     (- (.getTime (js/Date.)) start-time)
                                  }))
                     (swap! history-order inc)
                     ))
                  }))))





(defn admin []
(go
 (let [ll  (<! (neo4j "match (n:WebSession) return n.session_id"
                      {} "n.session_id"))]

   (reset! playback-controls-state (assoc-in
                                    @playback-controls-state
                                    [:data :sessions]  (into [](take 5 ll))))
   (om/root
    playback-controls-view
    playback-controls-state
    {:target (js/document.getElementById "playback_controls")})

   (om/root
     ankha/inspector
     playback-controls-state
     {:target (js/document.getElementById "playback_state")})

   )))





(defn ^:export load_main []
   (main))




(defn ^:export load_admin []
  (admin))
