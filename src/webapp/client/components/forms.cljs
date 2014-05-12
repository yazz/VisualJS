(ns webapp.client.components.forms
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]]
   [om-sync.core     :as async]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [webapp.framework.client.components.fields.labelled-text-field :as labelled-field]
    )

  (:use
   [webapp.framework.client.coreclient      :only  [log remote]])


  (:use-macros
   [webapp.framework.client.neo4j      :only  [neo4j]])

  (:require-macros
   [cljs.core.async.macros :refer [go]]))







(defn handle-change [app field e owner]
  (om/update! app [field :value] (.. e -target -value)))











(defn request-form [{:keys [request data]} owner]
  (reify

    ;---------------------------------------------------------
    om/IRender
    (render
     [this]
     (dom/div
      nil
      (dom/div #js {:style #js {:padding-top "40px"}} " You ")

      (om/build labelled-field/component  {:field (-> request :from-full-name)})
      (om/build labelled-field/component  {:field (-> request :email-from)})

      (dom/div #js {:style #js {:padding-top "40px"}} " Them ")

      (om/build labelled-field/component  {:field (-> request :to-full-name)})
      (om/build labelled-field/component  {:field (-> request :email-to)})



      (dom/div
       #js {:style
            #js {:padding-top "40px"}}
       "The expertise your company has you want them to endorse ")


      (dom/div
       #js {:className "input-group"}

       (dom/span #js {:className "input-group-addon"}
                 "Skill your company has")
       (dom/input #js {:type        "text"
                       :className   "form-control"
                       :placeholder "marketing"}))
      ))
    ;---------------------------------------------------------

))



