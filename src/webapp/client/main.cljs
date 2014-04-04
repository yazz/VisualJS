(ns webapp.client.main
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [cljs.core.async  :refer [put! chan <!]]
   [clojure.data     :as data]
   [clojure.string   :as string]
   )
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



(comment go
  (log  (<! (neo4j "MATCH (n)
                   OPTIONAL MATCH (n)-[r]-()
                   DELETE n,r" {} ))))




(go
   (log  (<! (neo4j "match n return count(n)" {} ))))



(go
   (log  (<! (neo4j
              "create  (n:SendEndorsement
                            {
                              from:                 'zubairq@gmail.com',
                              to:                   'zq@nemcv.com',
                              send_endorsement:     'web design',
                              requested_timestamp:  {time}
                            }) return n"
              {:time (.getTime (js/Date.))} "n"))))



( go
   (log  (<! (neo4j "match n return count(n)" {}  )))
 )



( go
   (log  (<! (neo4j "match (n:SendEndorsement) return n" {} "n" )))
 )

(comment go
   (log  (<! (neo4j "match n:* return n" {} "n" )))
 )



(def app-state
  (atom
    {:contacts
     []}))










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













(defn main-view [app owner]
  (reify

    om/IInitState
    ;------------

    (init-state [_]
                {:delete (chan)})

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

    (render-state [this state]
                  (dom/div nil
                           (dom/h2 nil "Contact list")
                           (apply dom/ul #js {:className "boon"}
                                  (om/build-all contact-view (:contacts app)
                                                {:init-state state}))
                           (dom/div nil
                                    (dom/input #js {:type "text" :ref "new-contact"})
                                    (dom/button #js {:onClick #(add-contact app owner)} "Add contact"))))))


(go
  (log (<! (neo4j "match n return count(n)" {})))
)










(defn ^:export main []
  (om/root   main-view
             app-state
             {:target (. js/document (getElementById "main"))}))



