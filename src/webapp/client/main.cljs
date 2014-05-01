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





(defn add-broswer-details [field value]
  (reset! app-state (assoc-in @app-state [:system field ] value))
  )





(defn detect-browser []
  (add-broswer-details :cookie-enabled (.-cookieEnabled js/navigator))
  (add-broswer-details :language (.-language js/navigator))
  (add-broswer-details :platform (.-platform js/navigator))
  (add-broswer-details :who-am-i (.-sayswho js/navigator))
  )




(defn main []
  (go
   (reset-app-state)
   (detect-browser)
   (let [session (:value (<! (remote "create-session"
                                     {
                                      :init-state (with-out-str (prn @app-state))
                                      })  ))]
     (log session)
     (reset! session-id session))



    (comment om/root
     ankha/inspector
     app-state
     {:target (js/document.getElementById "main_playback")})

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
                     (log (str "txdata:::" tx-data))
                     (log (str "path:::" (:path tx-data)))
                     (log (str "new-value:::"
                               (with-out-str (prn (:new-value tx-data)))))
                     (put! tx-chan [tx-data root-cursor])

                     (<! (remote "add-history"
                                 {
                                  :session-id    @session-id
                                  :history-order (swap! history-order inc)
                                  :path          (:path tx-data)
                                  :new-value     (with-out-str (prn
                                                                (:new-value tx-data)))
                                  :timestamp     (- (.getTime (js/Date.)) start-time)
                                  }))
                     ))
                  }))))




(defn get-web-sessions []
  (neo4j "match (n:WebSession) return n.session_id"
                      {} "n.session_id"))





(defn admin []
  (go
   (let [ll  (<! (get-web-sessions))]

     (reset! playback-controls-state (assoc-in
                                      @playback-controls-state
                                      [:data :sessions]  (into [](take 5 ll))))
     (om/root
      playback-controls-view
      playback-controls-state
      {:target (js/document.getElementById "playback_controls")})
     )))





(defn ^:export load_main []
   (main))




(defn ^:export load_admin []
  (admin))
