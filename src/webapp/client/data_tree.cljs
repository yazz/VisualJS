(ns webapp.client.data-tree
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]]
   [om-sync.core     :as async]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [ankha.core       :as ankha]
   [webapp.client.timers]
   )
  (:use
   [webapp.client.helper                    :only  [when-path-equals when-value-changes]]
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












(when-path-equals  data-watchers
 [:submit :status]     "ConfirmedSender"

 (fn [data ui]
   (go
    (om/update! ui [:ui :request :from-email :confirmed]  true)
    )
   ))







(when-path-equals  data-watchers
 [:submit :status]     "ConfirmedReceiver"

 (fn [data ui]
   (go
    (om/update! ui [:ui :request :to-email :confirmed]  true)
    )
   ))










(when-path-equals data-watchers
 [:submit]     "Submitted"

 (fn [app]
     (log "sent")
     ))








