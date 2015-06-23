(ns webapp.framework.client.components.system-container
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
   [webapp.framework.client.coreclient           :only  [remote-fn debug-mode component-fn
                                                         remove-debug-event]]
   [webapp.framework.client.components.admin     :only  [admin-view]]
   [webapp.framework.client.system-globals       :only  [app-state
                                                         playbackmode
                                                         ui-watchers
                                                         data-watchers
                                                         start-component
                                                         data-state
                                                         ab-tests
                                                         init-state-fns
                                                         data-and-ui-events-on?
                                                         global-om-state
                                                         add-debug-event]])
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













(defn on-mouse [e app]

  (let [mousex (.-clientX e)
        mousey (.-clientY e)
        ]
    ;(log (str "x=" mousex ", " "y=" mousey  ))
    (if (or
         (< mousex (- (get-in @app [:pointer :mouse-x]) 30))
         (> mousex (+ (get-in @app [:pointer :mouse-x]) 30))
         (< mousey (- (get-in @app [:pointer :mouse-y]) 30))
         (> mousey (+ (get-in @app [:pointer :mouse-y]) 30))
         )

      (do
        (if (not (= (get-in @app [:pointer :mouse-x]) mousex))
          (om/update! app [:pointer :mouse-x] mousex))
        (if (not (= (get-in @app [:pointer :mouse-y]) mousey))
          (om/update! app [:pointer :mouse-y] mousey))
        ))))










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
                           (let [debug-id
                                 (add-debug-event
                                  :event-type  "event"
                                  :event-name  (str "==" tree-name " " (:path watch) " " (:value watch))
                                  )]
                             (do
                               ;(apply (:fn watch) args)
                               (go (>! ch {:watch watch :extra []}))
                               ;(log (str "path equals"))
                               ;(swap! ch conj {:watch watch :extra []})
                               ;(swap! app-state assoc :touch-id (rand-int 99999))
                               ;(remove-debug-event  debug-id)

                               )))



                         (= (:type watch) "value change")
                         ;-------------------------------
                         (let [debug-id
                               (add-debug-event
                                :event-type  "event"
                                :event-name  (str "watch-" tree-name " " (:path watch))
                                )]
                           (do
                             ;                               (. js/console log  (str "value change"))
                             ;(js/alert (str "watch-" tree-name " " (:path watch)))
                             ;(apply (:fn watch) args)
                             (go (>! ch {:watch watch :extra []}))
                             ;(swap! ch conj {:watch watch :extra []})
                             ;(swap! app-state assoc :touch-id (rand-int 99999))
                             ;(remove-debug-event  debug-id)
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



                         ))


                      :else
                      nil )))))))





















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
                  (if (not @playbackmode)
                           (dorun (for [init-state-fn  @init-state-fns]
                                    (do
                                      (init-state-fn)
                                      ))))


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
                                    data-chan)


                  ))


















    ;---------------------------------------------------------
    om/IRenderState
    (render-state
     [this state]

     (do
       (reset! global-om-state app)
       ;(log "(reset! global-om-state app)")


       (dom/div nil
                  (if @playbackmode
                    (dom/div #js {:style #js {:fontWeight "bold"}}
                             (str (-> app :system :platform) ","
                                  (-> app :system :who-am-i))))
                  (dom/div #js {:style
                                (if @playbackmode #js {
                                                       :position "relative"
                                                       :border "2px black solid"
                                                       :margin "10px"
                                                       :width    (-> app :view :width)
                                                       :height   (-> app :view :height)
                                                       }

                                  #js {
                                       :position "relative"
                                       })


                                :id "mainel"  :onMouseMove
                                (fn[e] (if (not @playbackmode) (on-mouse e app)))}
                           ;(if @playbackmode (on-mouse e app)) (-> app :pointer :mouse-y)) ")"


                           (do
                             (let [path []]
                               (cond
                                (get app :admin)
                                 (component    admin-view       app  [])

                                (not (get app :admin))
                                 (component    @start-component app  [])
                                 )
                               )
                             )

                           (if @playbackmode
                             (dom/div #js {
                                           :style
                                           #js {
                                                :position  "absolute"
                                                :left      (str (-> app :pointer :mouse-x) "px")
                                                :top       (str (-> app :pointer :mouse-y) "px")
                                                :z-index   100
                                                }} "X"))

                           (if @debug-mode
                             (dom/div #js {
                                           :style
                                           #js {
                                                :marginTop "30px"
                                                }}
                                      (dom/button #js {:onClick (fn [e]
                                                                  (om/root ankha/inspector app-state
                                                                           {:target (js/document.getElementById "playback_state")})
                                                                  nil )} "UI state")

                                      (dom/button #js {:onClick (fn [e]
                                                                  (om/root ankha/inspector data-state
                                                                           {:target (js/document.getElementById "data_state")})
                                                                  nil )} "Data state")
                                      (dom/button #js {:onClick (fn [e]
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
