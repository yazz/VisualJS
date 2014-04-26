(ns webapp.client.components.playback
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
                                               reset-app-state
                                               reset-playback-app-state]]
   [webapp.client.components.views     :only  [main-view]]
   [webapp.client.components.forms     :only  [request-form]]
   )
  (:use-macros
   [webapp.framework.client.neo4j      :only  [neo4j]]
   )
  (:require-macros
   [cljs.core.async.macros :refer [go]]))









(def playbacktime (atom 0))

(defn playback-session [& {:keys
                           [session-id]}]
  (go (let [ll (<! (neo4j "
                          match (r:WebRecord) where
                          r.session_id={session_id}
                          return r order by r.seq_ord
                          "
                          {:session_id    session-id}
                          "r"))]

        (om/root
         main-view
         playback-app-state
         {:target (js/document.getElementById "playback_canvas")})


        (reset-playback-app-state)
        (doseq [item ll]
          (let [
                path      (cljs.reader/read-string (:path (into {} item )))
                content   (cljs.reader/read-string (:new_state (into {} item )))
                timestamp   (:timestamp (into {} item ))
                ]
            (log path)
            (log content)
            (log timestamp )
            (<! (timeout (-  timestamp @playbacktime)))
            (reset! playbacktime timestamp)
            (reset! playback-app-state  content)

            nil
            )
          )
        ))
  )





(defn replay-session [session-id]
  (go
   (let [ll  (<! (neo4j "match (n:WebSession) return n.session_id"
                        {} "n.session_id"))]

     (reset! playback-controls-state (assoc-in
                                      @playback-controls-state
                                      [:data :sessions]  (into [](take 5 ll))))

     (om/root
      main-view
      playback-app-state
      {:target (js/document.getElementById "playback_canvas")}))))






(defn playback-session-button-component [{:keys [ui data sessions]} owner]
  (reify

    om/IRenderState
    ;---------

    (render-state
     [this {:keys [highlight unhighlight]}]

       (dom/div nil

              (dom/div
               #js {
                    :style      #js {:padding-top "40px"
                                     :backgroundColor
                                     (if
                                       (= (get-in ui
                                               [:sessions data :highlighted]) "true")
                                       "lightgray"
                                       "white"
                                       )
                                     }

                    :onClick
                      (fn [e]  (playback-session  :session-id  data))

                    :onMouseEnter
                      (fn[e]   (put! highlight    data))
                    :onTouchStart
                      (fn[e]   (put! highlight    data))

                    :onMouseLeave
                      (fn[e]   (put! unhighlight  data))
                    :onTouchEnd
                      (fn[e]   (put! highlight  data))
                    :onTouchMove
                      (fn[e]   (put! highlight  data))
                    }
               (str data))))))















(defn playback-controls-view [app owner]

  (reify

    om/IInitState
    ;------------

    (init-state [_]

                {
                   :highlight                (chan)
                   :unhighlight              (chan)
                   :clear-replay-sessions    (chan)
                })

    om/IWillMount
    ;------------
    (will-mount [_]
                (let [
                      highlight               (om/get-state owner :highlight)
                      unhighlight             (om/get-state owner :unhighlight)
                      clear-replay-sessions   (om/get-state owner :clear-replay-sessions)
                      ]
                  (go (loop []
                        (let [session (<! highlight)]
                          ;(log "****HIGHLIGHT")
                          (om/transact!
                           app
                           [:ui :sessions session :highlighted] (fn[x] "true" ))
                          (recur))))

                  (go (loop []
                        (let [session (<! unhighlight)]
                          ;(log "****UNHIGHLIGHT")
                          (om/transact!
                           app
                           [:ui :sessions session :highlighted] (fn[x] "false" ))
                          (recur))))
                  (go (loop []
                        (let [session (<! clear-replay-sessions)]
                          (log "****CLEAR REPLAY")
                          (om/transact!
                           app
                           [:data :sessions] (fn[x] {} ))
                          (<! (remote "clear-playback-sessions" {}))
                          (recur))))

                  ))

    om/IRenderState
    ;--------------

    (render-state
     [this {:keys [highlight
                   unhighlight
                   clear-replay-sessions]}]
     (comment log (str "map="(mapv
                                      (fn [x]
                                        {
                                        :ui      (-> app :ui)
                                        :data    x
                                        }
                                        )
                                      (-> app :data :sessions))))

     (dom/div nil
              (dom/h2 nil "Playback web sessions")


              (apply dom/ul nil
                     (om/build-all  playback-session-button-component
                                    (mapv
                                     (fn [x]
                                       {
                                        :ui         (-> app :ui)
                                        :sessions   (-> app :data :sessions)
                                        :data       x
                                        }
                                       )
                                     (-> app :data :sessions)

                                     )
                                    {:init-state {:highlight    highlight
                                                  :unhighlight  unhighlight}}
                                    )
                     )

              (dom/button #js {:onClick (fn [e] (put! clear-replay-sessions
                                                      true))} "Delete")


              ))))
