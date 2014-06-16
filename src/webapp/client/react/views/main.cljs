(ns webapp.client.react.views.main
  (:require
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [webapp.framework.client.coreclient])

  (:use
   [webapp.client.ui-helpers                :only  [validate-email
                                                    validate-full-name
                                                    validate-endorsement
                                                    blur-field
                                                    update-field-value
                                                    basic-input-box ]]
   [clojure.string :only [blank?]]
   [webapp.client.react.components.forms               :only  [request-form]]
   [webapp.client.react.components.connection-graph    :only  [graph text-graph]]
   [webapp.client.react.components.company-details  :only [company-details]]
   )
  (:use-macros
   [webapp.framework.client.coreclient      :only  [defn-ui-component]]))







(defn select-browser [e app]
  (om/update! app [:ui :tab]  "browser"))

(defn select-request [e app]
  (om/update! app [:ui :tab]  "request"))







;------------------------------------------------------------
(defn-ui-component     main-view   [app]
  {:absolute-path []}
;------------------------------------------------------------

  (dom/div nil
           (dom/h2 nil "ConnectToUs.co")



           (dom/ul
            #js {:className  "nav nav-tabs"}

            (dom/li #js {:className  (if (= (-> app :ui :tab) "browser") "active" "")   }
                    (dom/a #js {:className  ""
                                :onClick        (fn[e] (select-browser e app))
                                :onTouchStart   (fn[e] (select-browser e app))

                                } "Connections")
                    )
            (dom/li #js {:className  (if (= (-> app :ui :tab) "request") "active" "") }
                    (dom/a #js {:className  ""
                                :onClick        (fn[e] (select-request e app))
                                :onTouchStart   (fn[e] (select-request e app))


                                } "Request")
                    )

            )

           (cond
            (= (-> app :ui :tab) "request")
            (om/build  request-form  (-> app :ui :request))


            (and
             (= (-> app :ui :tab) "browser")
             (= (-> app :ui :tab-browser) "top companies"))
            (cond

             ;(= (-> app :ui :graph-ab-test) "text")
             true
             (om/build  text-graph    (-> app :ui :companies))


             (= (-> app :ui :graph-ab-test) "SVG")
             (om/build  graph
                        {
                         :data    (:data    app)
                         }))




           (and
             (= (-> app :ui :tab) "browser")
             (= (-> app :ui :tab-browser) "company"))

             (om/build  company-details   (-> app :ui :company-details))


)))
