(ns webapp.framework.client.components.system-container
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [ankha.core       :as ankha])

  (:use
   [webapp.framework.client.coreclient           :only  [remote-fn debug-mode component-fn]]
   [webapp.framework.client.components.admin     :only  [admin-view]]
   [webapp.framework.client.system-globals       :only  [app-state
                                                         ui-watchers
                                                         data-watchers
                                                         start-component
                                                         data-state
                                                         init-state-fns
                                                         data-and-ui-events-on?
                                                         global-om-state]])
  (:use-macros
   [webapp.framework.client.coreclient :only  [defn-ui-component ns-coils div component remote
                                               admin watch-data <--data -->ui
                                               ns-coils   log]])
  (:require-macros
   [cljs.core.async.macros :refer [go]]))
(ns-coils 'webapp.framework.client.components.system-container)















(def ui-events   (atom []))
(def data-events (atom []))
(def ui-chan     (chan))
(def data-chan   (chan))













(defn subtree-different? [orig-val new-val path]
  (let [
        orig-subset    (get-in orig-val  path)
        new-subset     (get-in new-val   path)
        ]
      (not (identical?  orig-subset  new-subset))))


















(defn add-as-watch [the-ref  tree-name  watchers   args  ch]

  (add-watch the-ref :events-change

             (fn [_ _ old-val new-val]

               (if @data-and-ui-events-on?
                 (doall

                  ;(. js/console log (pr-str "Events changed" ))
                  (for [watch @watchers]
                    (if (subtree-different? old-val new-val (:path watch))
                      (do
;                        (. js/console log  (str "Subtree changed: " (:path watch)))
                        (cond

                         (= (:type watch) "path equals")
                         ;------------------------------
                         (if (= (get-in new-val (:path watch)) (:value watch) )
                           (let []
                             (do
                               ;(apply (:fn watch) args)
                               (go (>! ch {:watch watch :extra []}))
                               ;(log (str "path equals"))
                               ;(swap! ch conj {:watch watch :extra []})
                               ;(swap! app-state assoc :touch-id (rand-int 99999))

                               )))



                         (= (:type watch) "value change")
                         ;-------------------------------
                         (let []
                           (do
                             ;                               (. js/console log  (str "value change"))
                             ;(js/alert (str "watch-" tree-name " " (:path watch)))
                             ;(apply (:fn watch) args)
                             (go (>! ch {:watch watch :extra []}))
                             ;(swap! ch conj {:watch watch :extra []})
                             ;(swap! app-state assoc :touch-id (rand-int 99999))
                             ))



                         (= (:type watch) "record property equals")
                         ;-----------------------------------------
                         (let [records (filter
                                        (fn [r] (=  (get r (:field watch)) (:value watch)))
                                        (get-in new-val (:path watch))
                                        )]
                           (if (pos? (count records))
                             (do
                               ;(. js/console log  (str "record property equals"))
                               ;(apply (:fn watch) (conj args records))
                               (go (>! ch {:watch watch :extra records}))
                               ;(swap! ch conj {:watch watch :extra records})
                               (swap! app-state assoc :touch-id (rand-int 99999))
                               ;nil
                               )))
                         :else
                         nil


                         ))))


                      )))))





















( go (loop []
      (let [ui-event (<! ui-chan)]
        (do
          ;(. js/console log (pr-str "****CALLED UI EVENT: "  (:type (:watch ui-event)) ":" (:path (:watch ui-event))  ))
          ;(. js/console log (pr-str "****FN: "  (:fn (:watch ui-event)) ))
          ;(. js/console log (pr-str "****extra: "  (:extra ui-event)) )
          ;(. js/console log (pr-str "****app: "  app) )
          ;(. js/console log (pr-str "****Om : "  @global-om-state) )
          ;(. js/console log (pr-str "****App : "  @app-state) )
          (if @global-om-state
            (apply (:fn (:watch ui-event)) (conj [@global-om-state] (:extra ui-event)) )
            ;(. js/console log (pr-str "No globAL OM STATE" ) )
            )
          ;(swap! app-state assoc :touch-id (rand-int 99999))
          (recur)))))


( go (loop []
      (let [data-event (<! data-chan)]
        (do
          ;(. js/console log (pr-str "****CALLED DATA EVENT: "  (:type (:watch data-event)) ":" (:path (:watch data-event))  ))
          ;(. js/console log (pr-str "****FN: "  (:fn (:watch ui-event)) ))
          ;(. js/console log (pr-str "****extra: "  (:extra ui-event)) )
          ;(. js/console log (pr-str "****app: "  app) )
          ;(. js/console log (pr-str "****Om : "  @global-om-state) )
          (if @global-om-state
            (apply (:fn (:watch data-event)) (conj [@global-om-state] (:extra data-event)) )
            ; (. js/console log (pr-str "No globAL OM STATE" ) )
            )
          ;(swap! app-state assoc :touch-id (rand-int 99999))
          (recur)))))



















(defn main-view [app owner]
  (reify
    ;---------------------------------------------------------
    om/IWillUpdate
      (will-update [this next-props next-state]
        ;(reset! global-om-state app)
        ;(log "(reset! global-om-state app)")
                   )

    om/IDidUpdate
    (did-update [_ _ _ ]
      ;(reset! global-om-state app)
      ;(log "(reset! global-om-state app)")


                )

    om/IWillMount
    (will-mount [_]
                (do
                  ;(log "Mounting main component")
                  (reset! global-om-state app)

                  ; set up the initial state
                  (dorun (for [init-state-fn  @init-state-fns]
                           (do
                             (init-state-fn)
                             )))


                  ; set up the UI and data watchers
                    (add-as-watch   global-om-state
                                    "ui"
                                    ui-watchers
                                    [app]
                                    ui-chan)




                    (add-as-watch   data-state
                                    "data"
                                    data-watchers
                                    [app]
                                    data-chan)))


















    ;---------------------------------------------------------
    om/IRenderState
    (render-state
     [this state]

     (do
       (reset! global-om-state app)
       ;(log "(reset! global-om-state app)")


       (dom/div nil
                  (dom/div
                    #js {:style #js {:position "relative"}


                         :id "mainel"
                         }


                           (do
                             (let [path []]
                               (cond
                                (get app :admin)
                                 (component    admin-view       app  [])

                                (and app start-component (not (get app :admin)))
                                 (component    @start-component app  [])
                                 )
                               )
                             )

                           (if @debug-mode
                             (dom/div #js {
                                           :style
                                           #js {
                                                :marginTop "30px"
                                                }}
                                      (dom/button #js {:style #js  {:margin "10px" :color "red"}

                                                       :onClick (fn [e]
                                                                  (om/root ankha/inspector app-state
                                                                           {:target (js/document.getElementById "playback_state")})
                                                                  nil )} "UI state")

                                      (dom/button #js {:style #js  {:margin "10px" :color "blue"}

                                                       :onClick (fn [e]
                                                                  (om/root ankha/inspector data-state
                                                                           {:target (js/document.getElementById "data_state")})
                                                                  nil )} "Data state")
                                      (dom/button #js {:style #js  {:margin "10px" :color "green"}

                                                       :onClick (fn [e]
                                                                  (admin)
                                                                  nil )} "Admin")
                                      ))

                           ))))
    ;---------------------------------------------------------

))


(watch-data  [:data-sources]
			 "When the system data sources change add this to the admin console"
			 (do
			   (-->ui [:system :ui :data-sources :values] (<--data [:data-sources]))
			   )
			 )
