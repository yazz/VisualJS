(ns webapp.client.ui-tree
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [ankha.core       :as ankha]
   [webapp.client.timers]
   )
  (:use
   [webapp.client.ui-helpers                :only  [validate-email validate-full-name  validate-endorsement
                                                     blur-from-full-name   blur-to-full-name   blur-from-email    blur-to-email
                                                    blur-to-endorsement]]
   [webapp.client.helper                    :only  [when-path-equals when-value-changes
                                                    when-property-equals-in-record
                                                    amend-record
                                                    ]]
   [webapp.framework.client.coreclient      :only  [log remote]]
   [webapp.framework.client.system-globals  :only  [app-state   playback-app-state
                                                    playback-controls-state
                                                    reset-app-state ui-watchers
                                                    playbackmode start-component
                                                    data-watchers
                                                    data-state
                                                    update-data
                                                    update-ui
                                                    get-in-tree
                                                    ]]
   [clojure.string :only [blank?]]
   )
   (:require-macros
    [cljs.core.async.macros :refer [go]]))
















(when-path-equals ui-watchers
 [:ui :request :from-email :mode] "validate"

 (fn [ui]
   (if (validate-email
        (get-in-tree ui [:ui :request :from-email :value]))
     (update-ui ui [:ui :request :from-email :error] "")
     (update-ui ui [:ui :request :from-email :error] "Invalid email")
     )))



(when-value-changes ui-watchers
 [:ui :request :from-email :value]

 (fn [ui] (if (= (get-in-tree ui [:ui :request :from-email :mode]) "validate")
             (if (validate-email
                  (get-in-tree ui [:ui :request :from-email :value]))
               (update-ui ui [:ui :request :from-email :error] "")
               (update-ui ui [:ui :request :from-email :error] "Invalid email")
               ))))



(when-path-equals ui-watchers
 [:ui :request :from-full-name :mode] "validate"

 (fn [ui] (if (= (get-in-tree ui [:ui :request :from-full-name :mode]) "validate")
             (if (validate-full-name
                  (get-in-tree ui [:ui :request :from-full-name :value]))
               (update-ui ui [:ui :request :from-full-name :error] "")
               (update-ui ui [:ui :request :from-full-name :error] "Invalid full name")
               ))))



(when-value-changes  ui-watchers
 [:ui :request :from-full-name :value]

 (fn [ui] (if (= (get-in-tree ui [:ui :request :from-full-name :mode]) "validate")
             (if (validate-full-name
                  (get-in-tree ui [:ui :request :from-full-name :value]))
               (update-ui ui [:ui :request :from-full-name :error] "")
               (update-ui ui [:ui :request :from-full-name :error] "Invalid full name")
               ))))



(when-path-equals ui-watchers
 [:ui :request :to-full-name :mode]

 "validate"
 (fn [ui] (if (= (get-in-tree ui [:ui :request :to-full-name :mode]) "validate")
             (if (validate-full-name
                  (get-in-tree ui [:ui :request :to-full-name :value]))
               (update-ui ui [:ui :request :to-full-name :error] "")
               (update-ui ui [:ui :request :to-full-name :error] "Invalid full name")
               ))))


(when-value-changes ui-watchers
 [:ui :request :to-full-name :value]

 (fn [ui] (if (= (get-in-tree ui [:ui :request :to-full-name :mode]) "validate")
             (if (validate-full-name
                  (get-in-tree ui [:ui :request :to-full-name :value]))
               (update-ui ui [:ui :request :to-full-name :error] "")
               (update-ui ui [:ui :request :to-full-name :error] "Invalid full name")
               ))))





(when-path-equals ui-watchers
 [:ui :request :to-email :mode]     "validate"

 (fn [ui]
   (if (validate-email
        (get-in-tree ui [:ui :request :to-email :value]))
     (update-ui ui [:ui :request :to-email :error] "")
     (update-ui ui [:ui :request :to-email :error] "Invalid email")
     )))





(when-value-changes ui-watchers
 [:ui :request :to-email :value]

 (fn [ui] (if (= (get-in-tree ui [:ui :request :to-email :mode]) "validate")
             (if (validate-email
                  (get-in-tree ui [:ui :request :to-email :value]))
               (update-ui ui [:ui :request :to-email :error] "")
               (update-ui ui [:ui :request :to-email :error] "Invalid email")
               ))))






(when-path-equals ui-watchers
 [:ui :request :endorsement :mode]     "validate"

 (fn [ui]
   (if (validate-endorsement
        (get-in-tree ui [:ui :request :endorsement :value]))
     (update-ui ui [:ui :request :endorsement :error] "")
     (update-ui ui [:ui :request :endorsement :error] "Invalid endorsement")
     )))








(when-path-equals ui-watchers
 [:ui :request :submit :value]     true

 (fn [ui]
   (go
     (update-ui ui [:ui :request :submit :message] "Submitted")

     (update-data [:submit :status] "Submitted")
     (update-data [:submit :request :from-full-name]
                  (get-in @app-state [:ui :request :from-full-name :value]))
     (update-data [:submit :request :from-email]
                  (get-in @app-state [:ui :request :from-email :value]))
     (update-data [:submit :request :to-full-name]
                  (get-in @app-state [:ui :request :to-full-name :value]))
     (update-data [:submit :request :to-email]
                  (get-in @app-state [:ui :request :to-email :value]))
     (update-data [:submit :request :endorsement]
                  (get-in @app-state [:ui :request :endorsement :value]))

     (let [ l (<! (remote "request-endorsement"
             {
              :from-email     (get-in @data-state [:submit :request :from-email])
              :from-full-name (get-in @data-state [:submit :request :from-full-name])
              :to-email       (get-in @data-state [:submit :request :to-email])
              :to-full-name   (get-in @data-state [:submit :request :to-full-name])
              :endorsement    (get-in @data-state [:submit :request :endorsement])
              }))]

       ;(log (pr-str l))
       (update-data [:submit :request :endorsement-id]  (:endorsement_id l))
       )



     )))








(when-value-changes  ui-watchers
 [:ui :request :endorsement :value]

 (fn [ui] (if (= (get-in-tree ui [:ui :request :endorsement :mode]) "validate")
             (if (validate-endorsement
                  (get-in-tree ui [:ui :request :endorsement :value]))
               (update-ui ui [:ui :request :endorsement :error] "")
               (update-ui ui [:ui :request :endorsement :error] "Invalid endorsement")
               ))))




(when-property-equals-in-record  ui-watchers
 [:ui :companies :values] :clicked true

  (fn [ui records]
    (let [r (first records)]
    (js/alert (str "record:" r))
      (update-ui  ui
                   [:ui :companies :values]
                   (amend-record (into [] (get-in-tree ui [:ui :companies :values]))
                                 "company"
                                 (get r "company")
                                 (fn[z] (merge z {:clicked false}))
                                 ))
                     )))

