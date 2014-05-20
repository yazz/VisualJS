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
   [webapp.framework.client.coreclient      :only  [log remote]]
   [webapp.client.init :only [blur-from-full-name blur-from-email
                              blur-to-full-name blur-to-email
                              blur-to-endorsement]]
   [clojure.string :only [blank?]]

   )


  (:use-macros
   [webapp.framework.client.neo4j      :only  [neo4j]])

  (:require-macros
   [cljs.core.async.macros :refer [go]]))







(defn handle-change [app field e owner]
  (om/update! app [field :value] (.. e -target -value)))








(defn full-name-field [{:keys [request]} owner]
  (reify

    ;---------------------------------------------------------
    om/IRender
    (render
     [this]
     (dom/div nil
              (dom/div #js {:className "input-group"}

                       (dom/span
                        #js {:className "input-group-addon"}
                        (str "Your full name"))
                        (dom/input
                         #js {:type        "text"
                              :className   "form-control"
                              :placeholder "John Smith"
                              :value       (get-in request [:from-full-name :value])
                              :onChange    #(om/update! request
                                                         [:from-full-name :value]
                                                         (.. %1 -target -value))
                              :onBlur      #(blur-from-full-name  request)
                              })
                       (if (not (blank?
                                 (get-in request [:from-full-name :error])))
                             (dom/div nil "Full name must be at least 6 characters and contain a space")
                         )                       )
))))



(defn to-full-name-field [{:keys [request]} owner]
  (reify

    ;---------------------------------------------------------
    om/IRender
    (render
     [this]
     (dom/div nil
              (dom/div #js {:className "input-group"}

                       (dom/span
                        #js {:className "input-group-addon"}
                        (str "Their full name"))
                        (dom/input
                         #js {:type        "text"
                              :className   "form-control"
                              :placeholder "Pete Austin"
                              :value       (get-in request [:to-full-name :value])
                              :onChange    #(om/update! request
                                                         [:to-full-name :value]
                                                         (.. %1 -target -value))
                              :onBlur      #(blur-to-full-name  request)
                              })
                       (if (not (blank?
                                 (get-in request [:to-full-name :error])))
                             (dom/div nil "Full name must be at least 6 characters and contain a space")
                         )                       )
))))





(defn from-email-field [{:keys [request]} owner]
  (reify

    ;---------------------------------------------------------
    om/IRender
    (render
     [this]
     (dom/div nil
              (dom/div #js {:className "input-group"}

                       (dom/span
                        #js {:className "input-group-addon"}
                        (str "Your company email"))
                        (dom/input
                         #js {:type        "text"
                              :className   "form-control"
                              :placeholder "john@microsoft.com"
                              :value       (get-in request [:from-email :value])
                              :onChange    #(om/update! request
                                                         [:from-email :value]
                                                         (.. %1 -target -value))
                              :onBlur      #(blur-from-email  request)
                              })
                       (if (not (blank?
                                 (get-in request [:from-email :error])))
                             (dom/div nil "Email validation error")
                         )
                       )
))))


(defn to-email-field [{:keys [request]} owner]
  (reify

    ;---------------------------------------------------------
    om/IRender
    (render
     [this]
     (dom/div nil
              (dom/div #js {:className "input-group"}

                       (dom/span
                        #js {:className "input-group-addon"}
                        (str "Their company email"))
                       (dom/input
                        #js {:type        "text"
                             :className   "form-control"
                             :placeholder "pete@ibm.com"
                             :value       (get-in request [:to-email :value])
                             :onChange    #(om/update! request
                                                       [:to-email :value]
                                                       (.. %1 -target -value))
                             :onBlur      #(blur-to-email  request)
                             })
                       (if (not (blank?
                                 (get-in request [:to-email :error])))
                         (dom/div nil "Email validation error")
                         )
                       )))))



(defn endorsement-field [{:keys [request]} owner]
  (reify

    ;---------------------------------------------------------
    om/IRender
    (render
     [this]
     (dom/div nil
              (dom/div #js {:className "input-group"}

                       (dom/span
                        #js {:className "input-group-addon"}
                        (str "Skill your company has"))
                       (dom/input
                        #js {:type        "text"
                             :className   "form-control"
                             :placeholder "marketing"
                             :value       (get-in request [:endorsement :value])
                             :onChange    #(om/update! request
                                                       [:endorsement :value]
                                                       (.. %1 -target -value))
                             :onBlur      #(blur-to-endorsement  request)
                             })
                       (if (not (blank?
                                 (get-in request [:endorsement :error])))
                         (dom/div nil "Endorsement validation error")
                         )
                       )))))



(defn request-form [{:keys [request data]} owner]
  (reify

    ;---------------------------------------------------------
    om/IRender
    (render
     [this]
     (dom/div
      nil
      (dom/div #js {:style #js {:padding-top "40px"}} " You ")

      (om/build full-name-field  {:request request})
      (om/build from-email-field  {:request request})

      (dom/div #js {:style #js {:padding-top "40px"}} " Them ")

      ;(om/build labelled-field/component  {:field (-> request :to-full-name)})
      (om/build to-full-name-field  {:request request})

      (om/build to-email-field  {:request request})



      (dom/div
       #js {:style
            #js {:padding-top "40px"}}
       "The expertise your company has you want them to endorse ")


      (dom/div
       #js {:className "input-group"}

       (om/build endorsement-field  {:request request})

       )

      (dom/button #js {:onClick (fn [e] nil)
                       :style
                       #js {:margin-top "40px"}}
                  "Send request")

      ))
    ;---------------------------------------------------------

))



