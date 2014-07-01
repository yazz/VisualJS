(ns webapp.framework.client.components.fields.labelled-text-field
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]]
   [om-sync.core     :as async]
   [clojure.data     :as data]
   [clojure.string   :as string])

  (:use
   [webapp.framework.client.coreclient      :only  [log remote]])

  (:require-macros
   [cljs.core.async.macros :refer [go]]))






(defn handle-change [app e]
  (om/update! app [:value] (.. e -target -value))
  )






;-----------------------------------------------------------------------------------------------
(defn component [{:keys [field]} owner]
  (reify

    ;---------
    om/IRender
    (render
    ;------
     [this]
     ;-----

     (dom/div #js {:className "input-group"}

              (dom/span
               #js {:className "input-group-addon"}
               (get field :label ""))
              (dom/input
               #js {:type        "text"
                    :className   "form-control"
                    :placeholder (get field :placeholder "")
                    :value       (get field :value)
                    :onChange    #(handle-change field %)
                    }))
      ))

)



