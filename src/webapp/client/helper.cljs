(ns webapp.client.helper
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]]
   [om-sync.core     :as async]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [ankha.core       :as ankha]
   )
  (:use
   [webapp.framework.client.coreclient      :only  [log remote]]
   [webapp.framework.client.system-globals  :only  [app-state   playback-app-state
                                                    playback-controls-state
                                                    reset-app-state ui-watchers
                                                    playbackmode start-component
                                                    data-watchers
                                                    data-state
                                                    update-data
                                                    update-app
                                                    get-in-app
                                                    ]]
   [clojure.string :only [blank?]]
   )
   (:require-macros
    [cljs.core.async.macros :refer [go]]))








(defn when-path-equals [watcher path value fn-def]
  (swap! watcher conj
         {
          :type     "path equals"
          :path     path
          :value    value
          :fn       fn-def
          }))

(defn when-value-changes [watcher path fn-def]
  (swap! watcher conj
         {
          :type     "value change"
          :path     path
          :fn       fn-def
          }))


(defn amend-record [records field value amend-fn]
  (into [] (map
            (fn[x] (if (= (get x field) value) (amend-fn x) x))
            records ))
  )
