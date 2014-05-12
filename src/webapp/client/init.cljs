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
                                                    reset-app-state
                                                    playbackmode start-component ]]
))




(defn  ^:export setup []
   (reset! app-state (assoc-in @app-state [:ui]
                {:request {
                           :from-full-name       {:label "Your full name" :placeholder "John smith" :value "" }
                           :email-from           {:label "Your company email" :placeholder "john@microsoft.com" :value "" }

                           :to-full-name         {:label "Their full name" :placeholder "Pete Austin" :value ""}
                           :email-to             {:label "Their email" :placeholder "pete@ibm.com" :value ""}

                           :endorsement          {:value ""}
                           }
                 })))

