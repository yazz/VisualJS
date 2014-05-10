(ns webapp.framework.client.system-globals
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]]
   [om-sync.core     :as async]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [ankha.core       :as ankha])

  (:use
   [webapp.framework.client.coreclient :only  [log remote]]
   )
  (:use-macros
   [webapp.framework.client.coreclient :only  [ns-coils]]
   [webapp.framework.client.neo4j      :only  [neo4j]]
   )
  (:require-macros
   [cljs.core.async.macros :refer [go]]))


(def start-component (atom nil))


(def playbackmode (atom false))

(def app-state
  (atom
   {}))





(def blank-app-state
  {:ui

   {:request {
              :from-full-name       ""
              :email-from           ""

              :to-full-name         ""
              :email-to             ""

              :endorsement          ""
              }
    }
   :data {
          :width "50"
          }
   :pointer
   {
    :mouse-x 0
    :mouse-y 0
    }
   :view
   {
    :width   0
    :height  0
    }
   }
  )

;(reset! app-state (assoc-in @app-state [:data :width ] "20"))


(defn reset-app-state []
  (reset!  app-state  blank-app-state))









(def playback-app-state
  (atom
   {}))




(def playback-controls-state
  (atom
   {:ui
    {
     :current-session   nil
     :current-page      0
     }
    :data {
           :sessions          []
           }
    }

   ))

(defn reset-playback-app-state []
  (reset!  playback-app-state  blank-app-state))
