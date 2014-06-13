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
   [webapp.client.ui-helpers                :only  [validate-email validate-full-name  validate-endorsement
                                                     blur-from-full-name   blur-to-full-name   blur-from-email    blur-to-email    blur-to-endorsement]]
   [clojure.string :only [blank?]]
   [webapp.framework.client.system-globals  :only  [touch]]
   )


  (:use-macros
   [webapp.framework.client.neo4j      :only  [neo4j]]
   [webapp.framework.client.coreclient      :only  [def-ui-component]]
   )

  (:require-macros
   [cljs.core.async.macros :refer [go]]))







(defn handle-change [app field e owner]
  (om/update! app [field :value] (.. e -target -value)))








;------------------------------------------------------------
(def-ui-component     full-name-field    [:ui :request]
;------------------------------------------------------------

  (dom/div nil
           (dom/div #js {:className "input-group"}

                    (dom/span
                     #js {:className "input-group-addon"}
                     (str "Your full name"))
                    (dom/input
                     #js {:type        "text"
                          :className   "form-control"
                          :placeholder "John Smith"
                          :value       (get-in ui-data [:from-full-name :value])
                          :onChange    #(om/update! ui-data
                                                    [:from-full-name :value]
                                                    (.. %1 -target -value))
                          :onBlur      #(blur-from-full-name  ui-data)
                          })
                    (if (not (blank?
                              (get-in ui-data [:from-full-name :error])))
                      (dom/div nil "Full name must be at least 6 characters and contain a space")
                      ))
))






;------------------------------------------------------------
(def-ui-component   to-full-name-field  [:ui :request]
;------------------------------------------------------------

     (dom/div nil
              (dom/div #js {:className "input-group"}

                       (dom/span
                        #js {:className "input-group-addon"}
                        (str "Their full name"))
                        (dom/input
                         #js {:type        "text"
                              :className   "form-control"
                              :placeholder "Pete Austin"
                              :value       (get-in ui-data [:to-full-name :value])
                              :onChange    #(om/update! ui-data
                                                         [:to-full-name :value]
                                                         (.. %1 -target -value))
                              :onBlur      #(blur-to-full-name  ui-data)
                              })
                       (if (not (blank?
                                 (get-in ui-data [:to-full-name :error])))
                             (dom/div nil "Full name must be at least 6 characters and contain a space")
                         )                       )
))





;------------------------------------------------------------
(def-ui-component    from-email-field  [:ui :request]
;------------------------------------------------------------
     (dom/div nil
              (dom/div #js {:className "input-group"}

                       (dom/span
                        #js {:className "input-group-addon"}
                        (str "Your company email"))
                        (dom/input
                         #js {:type        "text"
                              :className   "form-control"

                              :placeholder "john@microsoft.com"
                              :value       (get-in ui-data [:from-email :value])
                              :onChange    #(om/update! ui-data
                                                         [:from-email :value]
                                                         (.. %1 -target -value))
                              :onBlur      #(blur-from-email  ui-data)
                              })
                       (if (not (blank?
                                 (get-in ui-data [:from-email :error])))
                             (dom/div nil "Email validation error"))

                       (if (get-in ui-data [:from-email :confirmed])
                         (dom/div  #js {:className "alert alert-success"}
                                   (dom/a  #js {:href "#"
                                                :className "alert-link"}
                                           "Your email confirmed"
                                           )))
)))






;------------------------------------------------------------
(def-ui-component  to-email-field  [:ui :request]
;------------------------------------------------------------

     (dom/div nil
              (dom/div #js {:className "input-group"}

                       (dom/span
                        #js {:className "input-group-addon"}
                        (str "Their company email"))
                       (dom/input
                        #js {:type        "text"
                             :className   "form-control"
                             :placeholder "pete@ibm.com"
                             :value       (get-in ui-data [:to-email :value])
                             :onChange    #(om/update! ui-data
                                                       [:to-email :value]
                                                       (.. %1 -target -value))
                             :onBlur      #(blur-to-email  ui-data)
                             })
                       (if (not (blank?
                                 (get-in ui-data [:to-email :error])))
                         (dom/div nil "Email validation error")
                         )


                       (if (get-in ui-data [:to-email :confirmed])
                         (dom/div  #js {:className "alert alert-success"}
                                   (dom/a  #js {:href "#"
                                                :className "alert-link"}
                                           "Their email confirmed"
                                           )))


                       )))







;------------------------------------------------------------
(def-ui-component   endorsement-field    [:ui :request]
;------------------------------------------------------------
     (dom/div nil
              (dom/div #js {:className "input-group"}

                       (dom/span
                        #js {:className "input-group-addon"}
                        (str "Skill your company has"))
                       (dom/input
                        #js {:type        "text"
                             :className   "form-control"
                             :placeholder "marketing"
                             :value       (get-in ui-data [:endorsement :value])
                             :onChange    #(om/update! ui-data
                                                       [:endorsement :value]
                                                       (.. %1 -target -value))
                             :onBlur      #(blur-to-endorsement  ui-data)
                             })
                       (if (not (blank?
                                 (get-in ui-data [:endorsement :error])))
                         (dom/div nil "Endorsement not valid")
                         )
                       )))






(def-ui-component   request-form    [:ui :request]
  (dom/div
   nil
   (dom/div
    nil
    (dom/div #js {:style #js {:padding-top "40px"}} "Your details (at your company)")

    (om/build full-name-field  ui-data)
    (om/build from-email-field   ui-data)

    (dom/div #js {:style #js {:padding-top "40px"}} " Them ")

    (om/build to-full-name-field  ui-data)

    (om/build to-email-field  ui-data)



    (dom/div
     #js {:style #js {:padding-top "40px"}}
     "The expertise your company has you want them to endorse")


    (dom/div #js {:className "input-group"}
             (om/build endorsement-field  ui-data))

    (dom/button #js {:onClick (fn [e]
                                (om/update! ui-data [:submit :value]  true))
                     :style
                     #js {:margin-top "40px"}}
                "Send request")

    (if (not (blank?
              (get-in ui-data [:submit :message])))
      (dom/div nil "Submitted")
))))



