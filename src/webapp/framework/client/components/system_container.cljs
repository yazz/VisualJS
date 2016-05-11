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
   [webapp.framework.client.system-globals       :only  [app-state
                                                         start-component
                                                         init-state-fns
                                                         debug-mode]])
  (:use-macros
   [webapp.framework.client.coreclient :only  [defn-ui-component ns-coils div component remote
                                                -->ui
                                               ns-coils   log]])
  (:require-macros
   [cljs.core.async.macros :refer [go]]))
(ns-coils 'webapp.framework.client.components.system-container)
























(defn main-view [app owner]
  (reify
    ;---------------------------------------------------------
    om/IWillUpdate
      (will-update [this next-props next-state]
                   (do
                     nil
                     ))

    om/IDidUpdate
    (did-update [_ _ _ ]
                   (do
                     nil
                     ))

    om/IWillMount
    (will-mount [_]
                (do

                  ; set up the initial state
                  (dorun (for [init-state-fn  @init-state-fns]
                           (do
                             (init-state-fn)
                             )))))











    ;---------------------------------------------------------
    om/IRenderState
    (render-state
     [this state]

     (do


       (dom/div nil
                  (dom/div
                    #js {:style #js {:position "relative"}


                         :id "mainel"
                         }


                           (do
                             (let [path []]
                               (cond

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


                                      ))


                    ))))))


