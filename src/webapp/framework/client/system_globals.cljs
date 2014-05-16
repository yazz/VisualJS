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


(defn subtree-different? [orig-val new-val path]
  (let [
        orig-subset    (get-in orig-val  path)
        new-subset     (get-in new-val   path)
        ]
      (not (identical?  orig-subset  new-subset))))

(def ui-watchers (atom []))

(add-watch app-state :events-change

    (fn [keya ab old-val new-val]
      (doall
       ;(. js/console log (pr-str "Events changed" new-val))
       (for [ui-watch @ui-watchers]
         (if (subtree-different? old-val new-val (:path ui-watch))
           (cond
            (= (:type ui-watch) "path-equals")
            (if (= (get-in new-val (:path ui-watch)) (:value ui-watch) )
              ((:fn ui-watch))
              )

            :else
            nil
            )
           )


         ))))



;@app-state

(def blank-app-state
  {
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




(def init-fn (atom nil))




(def playback-app-state
  (atom
   {}
   ))




(def playback-controls-state
  (atom
   {:ui
    {
     :current-session   nil
     :current-page      0
     :delete-password {:label "Delete password"
                       :placeholder ""
                       :value ""}

     }
    :data {
           :sessions          []
           }
    }

   ))

(defn reset-playback-app-state []
  (reset!  playback-app-state  blank-app-state))
