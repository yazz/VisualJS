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
   [webapp.client.timers]
   [webapp.client.data-tree]
   [webapp.client.ui-tree]
   )
  (:use
   [webapp.client.ui-helpers                :only  [validate-email validate-full-name  validate-endorsement]]
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









(defn  ^:export setup []

  (reset!
   app-state

   (assoc-in
    @app-state [:ui]
    {:request {
               :from-full-name       {:label "Your full name"      :placeholder "John smith"         :value ""  :mode "empty"}
               :from-email           {:label "Your company email"  :placeholder "john@microsoft.com" :value ""  :mode "empty"}

               :to-full-name         {:label "Their full name"     :placeholder "Pete Austin"        :value ""  :mode "empty"}
               :to-email             {:label "Their email"         :placeholder "pete@ibm.com"       :value ""  :mode "empty"}

               :endorsement          {:label "Endorsement"         :placeholder "marketing"          :value ""  :mode "empty"}
               :submit               {:value false}
               }

     :tab "browser"


     }))


  (reset! data-state {
                      :submit {}
                      }))







