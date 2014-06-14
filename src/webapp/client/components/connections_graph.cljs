(ns webapp.client.components.connections-graph
  (:require
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [ankha.core       :as ankha]
   [webapp.framework.client.coreclient]
   )
  (:use
   [webapp.client.helper  :only [amend-record]]
   [webapp.framework.client.system-globals  :only  [touch]]
   )
  (:use-macros
   [webapp.framework.client.coreclient      :only  [defn-ui-component]])
)





;---------------------------------------------------------
(defn-ui-component   text-graph    [companies]
  {:absolute-path [:ui :companies]}
;---------------------------------------------------------
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

      ))








;---------------------------------------------------------
(defn-ui-component   company-details    [company-details]
  {:absolute-path [:ui :tab-browser-details]}
;---------------------------------------------------------
  (dom/div
   #js {:style #js {:height "100%" :width "100%"}}

   (dom/div #js {:style #js {:padding-bottom "20px"}} "Company details")
   (dom/div #js {:style #js {:padding-bottom "20px"}}
            (str (-> company-details :company-url))
            )))
