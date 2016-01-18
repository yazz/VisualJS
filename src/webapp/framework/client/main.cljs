(ns webapp.framework.client.main
  (:require
    [goog.net.cookies :as cookie]
    [om.core          :as om :include-macros true]
    [om.dom           :as dom :include-macros true]
    [cljs.core.async  :refer [put! chan <! pub timeout]]
    [clojure.data     :as data]
    [clojure.string   :as string]
    [ankha.core       :as ankha]
    )

  (:use
    [webapp.framework.client.coreclient      :only  [remote-fn]]
    [webapp.framework.client.system-globals  :only  [app-state
                                                     playback-controls-state
                                                     reset-app-state
                                                     playbackmode
                                                     start-component
                                                     init-fn
                                                     data-state
                                                     app-watch-on?
                                                     record-ui
                                                     touch
                                                     data-session-id
                                                     client-session-atom
                                                     ]]
    [webapp.framework.client.components.system-container :only  [main-view]]
    ;   [webapp.framework.client.components.playback  :only  [playback-controls-view ]]
    )
  (:use-macros
    [webapp.framework.client.coreclient :only  [ns-coils remote log]]
    )
  (:require-macros
    [cljs.core.async.macros :refer [go]]))




(defn figwheel-update []
  (do
    (touch [:ui])
    (log "*** Updated UI from figwheel")))





(def history-order (atom 0))
(def start-time (.getTime (js/Date.)))









(defn add-browser-details [field value]
  (reset! app-state (assoc-in @app-state [:system field ] value)))




(defn add-view-details [field value]
  (reset! app-state (assoc-in @app-state [:view field ] value)))




(defn detect-browser []
  (add-browser-details :cookie-enabled (.-cookieEnabled js/navigator))
  (add-browser-details :language (.-language js/navigator))
  (add-browser-details :platform (.-platform js/navigator))
  (add-browser-details :who-am-i (js/sayswho))

  (add-view-details :width js/viewportw)
  (add-view-details :height js/viewporth))










(defn main []
  (go
    (reset-app-state)
    (@init-fn)
    (detect-browser)

    (let [cookie-session-id              (cookie/get "appshare.co")
          create-session-response        (remote !create-session {
                                                                   :init-state (with-out-str (prn @app-state))

                                                                   :browser    (str (-> @app-state :system :platform) ","
                                                                                    (-> @app-state :system :who-am-i))

                                                                   :session-id-from-browser    cookie-session-id
                                                                   })  ]
      (log (str "cookie-session-id: " cookie-session-id))
      (log (str "create-session-response: " create-session-response))
      ;(js/alert (pr-str @data-session-id))

      (reset! client-session-atom  {:session-id   (:session-id create-session-response)
                                    :user         (:user create-session-response)})

      (cookie/set "appshare.co" (:session-id create-session-response))
      (reset! data-session-id   (:data-session-id create-session-response)))


    (om/root   main-view
               app-state

               {:target (. js/document (getElementById "main"))})))












(defn ^:export defaultmain [app owner]
  (dom/div nil
           (dom/h2 nil "Clojure on coils")
           ))

(defn ^:export defaultinit []
  nil
  )


;--------------------------------------------------------
(defn ^:export  load_main [setup-config]
  ;-----------------------1---------------------------------
  (reset!  start-component  (get setup-config :start-component))
  (reset!  init-fn          (get setup-config :setup-fn))
  (main))
