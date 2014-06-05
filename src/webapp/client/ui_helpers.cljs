(ns webapp.client.ui-helpers
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











(defn validate-full-name [full-name]
  (if (and (> (count full-name) 6) (pos? (.indexOf full-name " ") ))
    true
    ))

(defn validate-endorsement [full-name]
  (if (> (count full-name) 2)
    true
    ))


(defn validate-email [email]
  (if (pos? (.indexOf (str email) "@"))
    true
    ))








(defn blur-from-full-name [request]
   (let [mode  (get-in @request [:from-full-name :mode])]
     (cond
      (and (= mode "empty") (not (blank? (get-in @request [:from-full-name :value]))))
      (om/update! request [:from-full-name :mode]  "validate")
      )))

(defn blur-to-full-name [request]
   (let [mode  (get-in @request [:to-full-name :mode])]
     (cond
      (and (= mode "empty") (not (blank? (get-in @request [:to-full-name :value]))))
      (om/update! request [:to-full-name :mode]  "validate")
      )))

(defn blur-from-email [request]
   (let [mode  (get-in @request [:from-email :mode])]
     (cond
      (and (= mode "empty") (not (blank? (get-in @request [:from-email :value]))))
      (om/update! request [:from-email :mode]  "validate")
      )))

(defn blur-to-email [request]
   (let [mode  (get-in @request [:to-email :mode])]
     (cond
      (and (= mode "empty") (not (blank? (get-in @request [:to-email :value]))))
      (om/update! request [:to-email :mode]  "validate")
      )))


(defn blur-to-endorsement [request]
   (let [mode  (get-in @request [:endorsement :mode])]
     (cond
      (and (= mode "empty") (not (blank? (get-in @request [:endorsement :value]))))
      (om/update! request [:endorsement :mode]  "validate")
      )))

