(ns webapp.client.components.forms
  (:require
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [webapp.framework.client.components.fields.labelled-text-field :as labelled-field])
  (:use
   [webapp.framework.client.coreclient      :only  [log
                                                    remote
                                                    process-ui-component]]
   [webapp.client.ui-helpers                :only  [validate-email
                                                    validate-full-name
                                                    validate-endorsement
                                                    blur-field
                                                    update-field-value]]
   [clojure.string :only [blank?]])
  (:use-macros
   [webapp.framework.client.coreclient      :only  [defn-ui-component]])
  (:require-macros
   [cljs.core.async.macros :refer [go]]))






;------------------------------------------------------------
(defn-ui-component     full-name-field   [field]
  {:absolute-path [:ui :request]}
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
                          :value       (get-in field [:value])
                          :onChange    #(update-field-value  field %1)
                          :onBlur      #(blur-field  field)
                          })

                    (if (not (blank? (get-in field [:error])))
                      (dom/div nil "Full name must be at least 6 characters and contain a space")
))))






;------------------------------------------------------------
(defn-ui-component   to-full-name-field  [ui-data]
  {:absolute-path [:ui :request]}
;------------------------------------------------------------

  (dom/div
   nil
   (dom/div #js {:className "input-group"}

            (dom/span
             #js {:className "input-group-addon"}
             (str "Their full name"))
            (dom/input
             #js {:type        "text"
                  :className   "form-control"
                  :placeholder "Pete Austin"
                  :value       (get-in ui-data [:value])
                  :onChange    #(update-field-value  ui-data %1)
                  :onBlur      #(blur-field  ui-data)
                  })
            (if (not (blank? (get-in ui-data [:error])))
              (dom/div nil
                       "Full name must be at least 6 characters and contain a space")
))))





;------------------------------------------------------------
(defn-ui-component    from-email-field  [ui-data]
    {:absolute-path [:ui :request]}
  ;------------------------------------------------------------
  (dom/div
   nil
   (dom/div #js {:className "input-group"}

            (dom/span
             #js {:className "input-group-addon"}
             (str "Your company email"))

            (dom/input
             #js {:type        "text"
                  :className   "form-control"
                  :placeholder "john@microsoft.com"
                  :value       (get-in ui-data [:value])
                  :onChange    #(update-field-value  ui-data %1)
                  :onBlur      #(blur-field  ui-data)
                  })

            (if (not (blank? (get-in ui-data [:error])))
              (dom/div nil "Email validation error"))

            (if (get-in ui-data [:confirmed])
              (dom/div  #js {:className "alert alert-success"}
                        (dom/a  #js {:href "#"
                                     :className "alert-link"}
                                "Your email confirmed"
                                )))
            )))






;------------------------------------------------------------
(defn-ui-component  to-email-field  [ui-data]
    {:absolute-path [:ui :request]}
  ;------------------------------------------------------------

  (dom/div
   nil
   (dom/div #js {:className "input-group"}

            (dom/span
             #js {:className "input-group-addon"}
             (str "Their company email"))

            (dom/input
             #js {:type        "text"
                  :className   "form-control"
                  :placeholder "pete@ibm.com"
                  :value       (get-in ui-data [:value])
                  :onChange    #(update-field-value  ui-data %1)
                  :onBlur      #(blur-field  ui-data)
                  })

            (if (not (blank?
                      (get-in ui-data [ :error])))
              (dom/div nil "Email validation error")
              )


            (if (get-in ui-data [:confirmed])
              (dom/div  #js {:className "alert alert-success"}
                        (dom/a  #js {:href "#"
                                     :className "alert-link"}
                                "Their email confirmed"
                                ))))))







;------------------------------------------------------------
(defn-ui-component   endorsement-field   [ui-data]
    {:absolute-path [:ui :request]}
;------------------------------------------------------------
  (dom/div
   nil
   (dom/div #js {:className "input-group"}

            (dom/span
             #js {:className "input-group-addon"}
             (str "Skill your company has"))
            (dom/input
             #js {:type        "text"
                  :className   "form-control"
                  :placeholder "marketing"
                  :value       (get-in ui-data [:value])
                  :onChange    #(update-field-value  ui-data %1)
                  :onBlur      #(blur-field  ui-data)
                  })
            (if (not (blank?
                      (get-in ui-data [ :error])))
              (dom/div nil "Endorsement not valid")
              ))))





;------------------------------------------------------------
(defn-ui-component   request-form   [ui-data]
    {:absolute-path [:ui :request]}
;------------------------------------------------------------

  (dom/div
   nil
   (dom/div
    nil
    (dom/div #js {:style #js {:padding-top "40px"}} "Your details (at your company)")

    (om/build full-name-field    (get-in ui-data [:from-full-name]))
    (om/build from-email-field   (-> ui-data :from-email ))

    (dom/div #js {:style #js {:padding-top "40px"}} " Them ")

    (om/build to-full-name-field  (-> ui-data :to-full-name ))
    (om/build to-email-field  (-> ui-data :to-email ))



    (dom/div
     #js {:style #js {:padding-top "40px"}}
     "The expertise your company has you want them to endorse")


    (dom/div #js {:className "input-group"}
             (om/build endorsement-field  (-> ui-data :endorsement )))

    (dom/button #js {:onClick (fn [e]
                                (om/update! ui-data [:submit :value]  true))
                     :style
                     #js {:margin-top "40px"}}
                "Send request")

    (if (not (blank?
              (get-in ui-data [:submit :message])))
      (dom/div nil "Submitted")
))))



