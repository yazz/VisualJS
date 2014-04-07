(ns webapp.client.main
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [cljs.core.async  :refer [put! chan <!]]
   [clojure.data     :as data]
   [clojure.string   :as string]
   [ankha.core       :as ankha])
  (:use
        [webapp.framework.client.coreclient :only  [log popup do-before-remove-element new-dom-id find-el
                                                    clj-to-js sql-fn header-text body-text body-html
                                                    make-sidebar  swap-section  el clear remote add-to]]
        [jayq.core                          :only  [attr $ css append fade-out fade-in empty]]
        [webapp.framework.client.eventbus   :only  [do-action esb undefine-action]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only    [define-action redefine-action]]
        [webapp.framework.client.coreclient :only  [ns-coils defn-html on-click on-mouseover]]
        [webapp.framework.client.neo4j       :only [neo4j]]
     )
  (:require-macros
   [cljs.core.async.macros :refer [go]]

   )
  )



(go
   (log  (<! (neo4j "match n return count(n)" ))))



(go
   (log  (<! (neo4j
              "create  (n:AskForEndorsement
                            {
                              from:                 'john@microsoft.com',
                              to:                   'pete@ibm.com',
                              endorsement:          'web design',
                              requested_timestamp:  {time}
                            }) return n"
              {:time (.getTime (js/Date.))} "n"))))



( go
   (log  (<! (neo4j "match (n:AskForEndorsement) return n" {} "n" )))
 )



(def app-state
  (atom
   {:request  {
               :email-from           "a"
               :from-full-name       "ssd"
               :email-to             ""
               :to-full-name         ""
               :endorsement          ""
               }
    }

   ))
(om/root
 ankha/inspector
 app-state
 {:target (js/document.getElementById "example")})


(comment reset! app-state
   {
    :from-full-name       "a"
    :email-from           ""
    :email-to             ""
    :send-endorsement     ""
    :receive-endorsement  ""
    })







(defn add-contact [app owner]
  (let [new-contact (-> (om/get-node  owner  "new-contact")
                        .-value)]
    (when new-contact
      (om/transact! app :contacts #(conj % {:name new-contact})))))





(defn contact-view [contact owner]
  (reify

    om/IRenderState
    ;--------------
    (render-state [this {:keys [delete]}]
      (dom/li nil
        (dom/span nil (:name contact))
        (dom/button #js {:onClick (fn [e] (put! delete @contact))} "Delete")))))







(defn handle-change [app e owner]
  (om/update! app [:from-full-name] (.. e -target -value))
  ;(log (.. e -target -value))
  )










(defn request-form [app owner]
  (reify

    om/IRender
    ;---------

    (render
     [this]
     (dom/div nil


              (dom/div #js {:style #js {:padding-top "40px"}} " You ")

              (dom/div #js {:className "input-group"}

                       (dom/span #js {:className "input-group-addon"}
                                 "Your full name")
                       (dom/input #js {:type "text"
                                       :className   "form-control"
                                       :placeholder "John Smith"
                                       :value       (-> app :from-full-name)
                                       :onChange    #(handle-change app % owner)
                                       }))

              (dom/div #js {:className "input-group"}

                       (dom/span #js {:className "input-group-addon"}
                                 "Your company email")
                       (dom/input #js {:type "text"
                                       :className "form-control"
                                       :placeholder "john@microsoft.com"}))





              (dom/div #js {:style #js {:padding-top "40px"}} " Them ")
              (dom/div #js {:className "input-group"}

                       (dom/span #js {:className "input-group-addon"}
                                 "Their full name")
                       (dom/input #js {:type "text"
                                       :className "form-control"
                                       :value       (-> app :from-full-name)
                                       :onChange    #(handle-change app % owner)
                                       :placeholder "Pete Austin"}))
              (dom/div #js {:className "input-group"}

                       (dom/span #js {:className "input-group-addon"}
                                 "Their email")
                       (dom/input #js {:type "text"
                                       :className "form-control"
                                       :placeholder "pete@ibm.com"}))





              (dom/div #js {:style #js {:padding-top "40px"}} " The skill you want them to endorse ")


              (dom/div #js {:className "input-group"}

                       (dom/span #js {:className "input-group-addon"}
                                 "Skill your company has")
                       (dom/input #js {:type "text"
                                       :className "form-control"
                                       :placeholder "marketing"}))

))))













(defn main-view [app owner]
  (reify

    om/IInitState
    ;------------

    (init-state [_]
                {
                   :delete            (chan)
                })

    om/IWillMount
    ;------------
    (will-mount [_]
                (let [delete (om/get-state owner :delete)]
                  (go (loop []
                        (let [contact (<! delete)]
                          (om/transact! app :contacts
                                        (fn [xs] (vec (remove #(= contact %) xs))))
                          (recur))))))

    om/IRenderState
    ;--------------

    (render-state
     [this state]
     (dom/div nil
              (dom/h2 nil "ConnectToUs.co")



              (om/build request-form (:request app))))))










(defn ^:export main []
  (om/root   main-view
             app-state
             {:target (. js/document (getElementById "main"))}))



