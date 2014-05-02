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
                                                         playback-controls-state
                                                         playbackmode]]
   [webapp.client.components.forms               :only  [request-form]]
   [webapp.client.components.connection-graph    :only  [graph]]
   )
  (:use-macros
   [webapp.framework.client.neo4j      :only  [neo4j]]
   )
  (:require-macros
   [cljs.core.async.macros :refer [go]]))







(defn on-mouse [e app]

  (let [mousex (.-clientX e)
        mousey (.-clientY e)
        ]
    (log (str "x=" mousex ", "
              "y=" mousey
              ))
    (if (not (= (get-in @app [:pointer :mouse-x]) mousex))
      (om/update! app [:pointer :mouse-x] mousex))
    (if (not (= (get-in @app [:pointer :mouse-y]) mousey))
      (om/update! app [:pointer :mouse-y] mousey))
    ))


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
                          (recur))))))
    ;---------------------------------------------------------


    om/IDidMount
    (did-mount [owner]
               []
               )




    ;---------------------------------------------------------
    om/IRenderState
    (render-state
     [this state]
     (dom/div #js {:style
                            #js {
                                 :position "relative"
                                 }

                   :id "mainel"  :onMouseMove
                   (fn[e] (on-mouse e app))}
              (str "(" (-> app :pointer :mouse-x) ", " (-> app :pointer :mouse-y)) ")"
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

              ))
    ;---------------------------------------------------------

))

@app-state
