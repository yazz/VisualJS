(ns webapp.client.globals
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




(def app-state
  (atom
   {:ui

    {:request {
               :from-full-name       "ssd"
               :email-from           "a"

               :to-full-name         "dfsfdsfdfds"
               :email-to             "to"

               :endorsement          ""
               }
     }
    :data {
           :a 1
           :b 2
           }
    }

   ))










(def playback-app-state
  (atom
   {:ui

    {:request {
               :from-full-name       "ssd"
               :email-from           "a"

               :to-full-name         "dfsfdsfdfds"
               :email-to             "to"

               :endorsement          ""
               }
     }
    :data {
           :a 1
           :b 2
           }
    }

   ))




(def playback-controls-state
  (atom
   {:ui

    {
    }
    :data {
           :sessions []
           :current-session nil
           }
    }

   ))
