 (ns webapp.client.init
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
                                                    playbackmode start-component ]]
   [clojure.string :only [blank?]]
))


(defn update-app [app path value]
  (om/update! app path value))

(defn get-in-app [app path]
  (get-in @app path))

(defn  ^:export setup []
   (reset! app-state (assoc-in @app-state [:ui]
                {:request {
                           :from-full-name       {:label "Your full name" :placeholder "John smith" :value "" :mode "empty"}
                           :from-email           {:label "Your company email" :placeholder "john@microsoft.com" :value ""  :mode "empty"}

                           :to-full-name         {:label "Their full name" :placeholder "Pete Austin" :value ""}
                           :to-email             {:label "Their email" :placeholder "pete@ibm.com" :value ""}

                           :endorsement          {:value ""}
                           }
                 })))


(defn validate-from-name [full-name]
  (if (and (> (count full-name) 3) (pos? (.indexOf full-name " ") ))
    true
    ))


(defn validate-email [email]
  (if (pos? (.indexOf (str email) "@"))
    true
    ))

(swap! ui-watchers conj {
                         :type     "path equals"
                         :path     [:ui :request :from-email :mode]
                         :value    "validate"
                         :fn       (fn [app]
                                     (if (validate-email
                                         (get-in-app app [:ui :request :from-email :value]))
                                      (update-app app [:ui :request :from-email :error] "")
                                      (update-app app [:ui :request :from-email :error] "Invalid email")
                                      ))
                         })

(swap! ui-watchers conj {
                         :type     "value change"
                         :path     [:ui :request :from-email :value]
                         :fn      (fn [app] (if (= (get-in-app app [:ui :request :from-email :mode]) "validate")
                                     (if (validate-email
                                         (get-in-app app [:ui :request :from-email :value]))
                                      (update-app app [:ui :request :from-email :error] "")
                                      (update-app app [:ui :request :from-email :error] "Invalid email")
                                      )))
                         })

;(update-app [:ui :request :from-email :error] "")



(defn blur-from-full-name [request]
   (let [mode  (get-in @request [:from-full-name :mode])]
     (cond
      (= mode "empty")
      (om/update! request [:from-full-name :mode]  "validate")
      )))


(defn blur-from-email [request]
   (let [mode  (get-in @request [:from-email :mode])]
     (cond
      (= mode "empty")
      (om/update! request [:from-email :mode]  "validate")
      )))


