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
   [webapp.framework.client.coreclient           :only  [log remote]]
   [webapp.framework.client.system-globals       :only  [app-state   playback-app-state
                                                         playback-controls-state
                                                         playbackmode ui-watchers
                                                         start-component]]
   )
  (:use-macros
   [webapp.framework.client.neo4j      :only  [neo4j]]
   )
  (:require-macros
   [cljs.core.async.macros :refer [go]]))




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
                          (om/transact!
                           app
                           :contacts
                           (fn [xs] (vec (remove #(= contact %) xs))))
                          (recur))))





                  (add-watch app-state :events-change
                             (fn [keya ab old-val new-val]
                               (doall
                                ;(. js/console log (pr-str "Events changed" new-val))
                                (for [ui-watch @ui-watchers]
                                  (if (subtree-different? old-val new-val (:path ui-watch))
                                    (cond
                                     (= (:type ui-watch) "path equals")
                                     (if (= (get-in new-val (:path ui-watch)) (:value ui-watch) )
                                       ((:fn ui-watch) app))

                                     (= (:type ui-watch) "value change")
                                     ((:fn ui-watch) app)
                                     :else
                                     nil ))))))




                  ))
    ;---------------------------------------------------------


    om/IDidMount
    (did-mount [owner]
               []
               )



    ;---------------------------------------------------------
    om/IRenderState
    (render-state
     [this state]

     (dom/div nil
     (if @playbackmode
       (dom/div #js {:style #js {:font-weight "bold"}}
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


              (@start-component    app    owner   state)

              (if @playbackmode
                (dom/div #js {
                            :style
                            #js {
                                 :position "absolute"
                                 :left (str (-> app :pointer :mouse-x) "px")
                                 :top (str (-> app :pointer :mouse-y) "px")
                                 :z-index 100
                                 }} "X"
                       ))

              )))
    ;---------------------------------------------------------

))


