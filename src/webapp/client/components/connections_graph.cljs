(ns webapp.client.components.connections-graph
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
   [webapp.client.helper  :only [amend-record]]
   [webapp.framework.client.coreclient      :only  [log remote]]
   )

  (:require-macros
   [cljs.core.async.macros :refer [go]]))





(defn text-graph [{:keys [companies]} owner]
  (reify

    ;---------------------------------------------------------
    om/IRender
    (render
     [this]
     (dom/div
      #js {:style #js {:height "100%" :width "100%"}}

      (dom/div #js {:style #js {:padding-bottom "20px"}} "Inbound connections")

      (apply dom/div nil
             (map
              (fn[x] (dom/div nil
                              (dom/div
                               #js {
                                    :style
                                    #js {
                                         :width "200px"
                                         :display "inline-block"}}
                               (get x "company"))
                              (dom/a #js {:href "#"
                                          :onClick

                                          #(om/update! companies [:values]
                                                       (amend-record (into [] (get @companies :values))
                                                                     "company"
                                                                     (get @x "company")
                                                                     (fn[z] (merge z {:clicked true}))
                                                       ))


                                          }
                                     (get x "inbound"))
                              ))
              (-> companies :values ))
             )

      ))))










(defn company-details [{:keys [company-details]} owner]
  (reify

    ;---------------------------------------------------------
    om/IRender
    (render
     [this]
     (dom/div
      #js {:style #js {:height "100%" :width "100%"}}

      (dom/div #js {:style #js {:padding-bottom "20px"}} "Company details")
      (dom/div #js {:style #js {:padding-bottom "20px"}}
               (str (-> company-details :company-url))
               )



      ))))




