(ns webapp.framework.client.components.debugger-main
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [ankha.core       :as ankha]
   [cljs.reader      :as reader]
   )

  (:use
   [webapp.framework.client.coreclient     :only  [remote-fn component-fn]]
   [webapp.framework.client.system-globals :only  [app-state
                                                   app-watch-on?]]
   )
  (:use-macros
   [webapp.framework.client.coreclient    :only  [component remote log]]
   )
  (:require-macros
   [cljs.core.async.macros :refer [go]]))










;-----------------------------------------------------
; The GUI tree used to show a clojure data structure
;-----------------------------------------------------
(defn show-tree [a-tree  is-map?  current-path   tree  debugger]
  (dom/div nil
         ""
            ))










(defn  ^:export loadDebugger []
  (do
   (reset! app-watch-on? false)
))



(defn  ^:export unloadDebugger []
  (do

nil

    ))

;(unloadDebugger)

