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

                           :to-full-name         {:label "Their full name" :placeholder "Pete Austin" :value ""   :mode "empty"}
                           :to-email             {:label "Their email" :placeholder "pete@ibm.com" :value ""  :mode "empty"}

                           :endorsement          {:value ""}
                           }
                 })))


(defn validate-full-name [full-name]
  (if (and (> (count full-name) 6) (pos? (.indexOf full-name " ") ))
    true
    ))


(defn validate-email [email]
  (if (pos? (.indexOf (str email) "@"))
    true
    ))

(defn when-path-equals [path value fn-def]
  (swap! ui-watchers conj
         {
          :type     "path equals"
          :path     path
          :value    value
          :fn       fn-def
          }))

(defn when-value-changes [path fn-def]
  (swap! ui-watchers conj
         {
          :type     "value change"
          :path     path
          :fn       fn-def
          }))



(when-path-equals
 [:ui :request :from-email :mode] "validate"

 (fn [app]
   (if (validate-email
        (get-in-app app [:ui :request :from-email :value]))
     (update-app app [:ui :request :from-email :error] "")
     (update-app app [:ui :request :from-email :error] "Invalid email")
     )))



(when-value-changes
 [:ui :request :from-email :value]

 (fn [app] (if (= (get-in-app app [:ui :request :from-email :mode]) "validate")
             (if (validate-email
                  (get-in-app app [:ui :request :from-email :value]))
               (update-app app [:ui :request :from-email :error] "")
               (update-app app [:ui :request :from-email :error] "Invalid email")
               ))))



(when-path-equals
 [:ui :request :from-full-name :mode] "validate"

 (fn [app] (if (= (get-in-app app [:ui :request :from-full-name :mode]) "validate")
             (if (validate-full-name
                  (get-in-app app [:ui :request :from-full-name :value]))
               (update-app app [:ui :request :from-full-name :error] "")
               (update-app app [:ui :request :from-full-name :error] "Invalid full name")
               ))))



(when-value-changes
 [:ui :request :from-full-name :value]

 (fn [app] (if (= (get-in-app app [:ui :request :from-full-name :mode]) "validate")
             (if (validate-full-name
                  (get-in-app app [:ui :request :from-full-name :value]))
               (update-app app [:ui :request :from-full-name :error] "")
               (update-app app [:ui :request :from-full-name :error] "Invalid full name")
               ))))



(when-path-equals
 [:ui :request :to-full-name :mode]

 "validate"
 (fn [app] (if (= (get-in-app app [:ui :request :to-full-name :mode]) "validate")
             (if (validate-full-name
                  (get-in-app app [:ui :request :to-full-name :value]))
               (update-app app [:ui :request :to-full-name :error] "")
               (update-app app [:ui :request :to-full-name :error] "Invalid full name")
               ))))


(when-value-changes
 [:ui :request :to-full-name :value]

 (fn [app] (if (= (get-in-app app [:ui :request :to-full-name :mode]) "validate")
             (if (validate-full-name
                  (get-in-app app [:ui :request :to-full-name :value]))
               (update-app app [:ui :request :to-full-name :error] "")
               (update-app app [:ui :request :to-full-name :error] "Invalid full name")
               ))))





(when-path-equals
 [:ui :request :to-email :mode]     "validate"

 (fn [app]
   (if (validate-email
        (get-in-app app [:ui :request :to-email :value]))
     (update-app app [:ui :request :to-email :error] "")
     (update-app app [:ui :request :to-email :error] "Invalid email")
     )))





(when-value-changes
 [:ui :request :to-email :value]

 (fn [app] (if (= (get-in-app app [:ui :request :to-email :mode]) "validate")
             (if (validate-email
                  (get-in-app app [:ui :request :to-email :value]))
               (update-app app [:ui :request :to-email :error] "")
               (update-app app [:ui :request :to-email :error] "Invalid email")
               ))))




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


