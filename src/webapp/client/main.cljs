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





;(cljs.reader/read-string (with-out-str (prn "abc cde")))

(defn main []
  (go
   (let [session (:value (<! (remote "create-session" {})  ))]
     (log session)
     (reset! session-id session))

    (reset-app-state)

    (comment om/root
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

;(with-out-str (prn "aa"))

(defn admin []
(go
 (let [ll  (<! (get-web-sessions))]

   (reset! playback-controls-state (assoc-in
                                    @playback-controls-state
                                    [:data :sessions]  (into [](take 5 ll))))
   ( om/root
    playback-controls-view
    playback-controls-state
    {:target (js/document.getElementById "playback_controls")})

   (comment om/root
     ankha/inspector
     playback-controls-state
     {:target (js/document.getElementById "playback_state")})

   )))


(comment go (log (<! (neo4j "match (n:WebRecord) where n.session_id='ba50fb61-367c-4a43-a2bd-4c94a19b22f1' return n order by n.seq_ord"
       {} "n"))))


(defn ^:export load_main []
   (main))




(defn ^:export load_admin []
  (admin))
