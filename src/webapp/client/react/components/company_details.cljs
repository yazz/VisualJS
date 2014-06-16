(ns webapp.client.react.components.company-details
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
(defn-ui-component   company-details    [company-details]
  {:absolute-path [:ui :company-details]}
;---------------------------------------------------------
  (dom/div
   #js {:style #js {:height "100%" :width "100%"}}

   (dom/div #js {:style #js {:padding-bottom "0px"}}
            (str (-> company-details :company-url)))
   (if (-> company-details :skills )
     (do
       (dom/div #js {:style #js {:padding-bottom "20px"}} "Skills2")
       (apply dom/div nil
              (map
               (fn[skill]
                 (dom/div #js {:style #js {:padding-left "20px"}}
                          (get skill "skill") " - " (get skill "skill_count")
                          ))
               (-> company-details :skills )
               ))
       )
     (dom/div #js {:style #js {:padding-bottom "20px"}} "Loading skills...")

     )
   (dom/div #js {:style #js {:padding-bottom "20px"}} "")

   (dom/button #js {:onClick
                    (fn [e]
                      (om/update! company-details [:clicked]  true))
                    :style
                    #js {:margin-top "40px"}}
                "Back")


   ))
