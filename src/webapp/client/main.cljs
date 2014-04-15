(ns webapp.client.main
  (:require
   [goog.net.cookies :as cookie]
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]]
      [om-sync.core :as async]

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
   [cljs.core.async.macros :refer [go ]]

   )
  )



(go
   (log  (<! (neo4j "match n return count(n)" ))))



(comment go
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
   (log  (map :neo-id (<! (neo4j "match (n) return n" {} "n" ))))
 )



(def app-state
  (atom
   {:ui

    {:request {
               :from-full-name       "ssd"
               :email-from           "a"

               :to-full-name         "dfsfdsfdfds"
               :email-to             "to"

               :endorsement          ""
               }
     }
    :data {
           :a 1
           :b 2
           }
    }

   ))

(def playback-app-state
  (atom
   {:ui

    {:request {
               :from-full-name       "ssd"
               :email-from           "a"

               :to-full-name         "dfsfdsfdfds"
               :email-to             "to"

               :endorsement          ""
               }
     }
    :data {
           :a 1
           :b 2
           }
    }

   ))

(def playback-controls-state
  (atom
   {:ui

    {
    }
    :data {
           :sessions ["f419280d-2843-43b8-8645-a50797890164"
                      "9325c569-b2a0-46b8-b8c3-2a4c52e98446"]
           :current-session nil
           }
    }

   ))





(om/root
 ankha/inspector
 app-state
 {:target (js/document.getElementById "example")})

(om/root
 ankha/inspector
 playback-controls-state
 {:target (js/document.getElementById "playback_state")})

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







(defn handle-change [app field e owner]
  (om/update! app [field] (.. e -target -value))
  ;(log (.. e -target -value))
  )











(defn request-form [{:keys [request data]} owner]
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
                                       :value       (-> request :from-full-name)
                                       :onChange    #(handle-change request :from-full-name % owner)
                                       }))

              (dom/div #js {:className "input-group"}

                       (dom/span #js {:className "input-group-addon"}
                                 "Your company email")
                       (dom/input #js {:type "text"
                                       :className "form-control"
                                       :value       (-> request :email-from)
                                       :onChange    #(handle-change request :emai-from % owner)
                                       :placeholder "john@microsoft.com"}))





              (dom/div #js {:style #js {:padding-top "40px"}} " Them ")
              (dom/div #js {:className "input-group"}

                       (dom/span #js {:className "input-group-addon"}
                                 "Their full name")
                       (dom/input #js {:type "text"
                                       :className "form-control"
                                       :value       (-> request :to-full-name)
                                       :onChange    #(handle-change request :to-full-name % owner)
                                       :placeholder "Pete Austin"}))
              (dom/div #js {:className "input-group"}

                       (dom/span #js {:className "input-group-addon"}
                                 "Their email")
                       (dom/input #js {:type "text"
                                       :className "form-control"
                                       :value       (-> request :email-to)
                                       :onChange    #(do
                                                       (handle-change request :emai-to % owner)
                                                       (om/update! request [ :email-from] "zoso")
                                                       )
                                       :placeholder "pete@ibm.com"}))





              (dom/div #js {:style #js {:padding-top "40px"}} " The expertise your company has you want them to endorse ")


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



              (om/build request-form {
                                      :request (-> app :ui :request)
                                      :data    (:data    app)
                                      }


                        )))))







(def history-order (atom 0))
(def start-time (.getTime (js/Date.)))






(def session-id (atom ""))
(go
 (let [session (:value (<! (remote "create-session" {})  ))]
   (log session)
   (reset! session-id session)
   )
)






(defn ^:export main []
  (let [tx-chan (chan)
      tx-pub-chan (pub tx-chan (fn [_] :txs))]
    (om/root   main-view
             app-state
             {:target (. js/document (getElementById "main"))
              :shared {:tx-chan tx-pub-chan}
              :tx-listen
              (fn [tx-data root-cursor]
                (log (str tx-data))
                (put! tx-chan [tx-data root-cursor])

                (go
                 (<! (remote "add-history"
                             {
                              :session-id    @session-id
                              :history-order @history-order
                              :history       tx-data
                              :timestamp     (- (.getTime (js/Date.)) start-time)
                            }))
                 (swap! history-order inc)
              ))})))


(def playback-state (atom {}))


(def playbacktime (atom 0))

(go (let [ll (<! (neo4j "
                        match (r:WebRecord) where
                        r.session_id='46dd7de8-8e6c-4f41-a80d-2d789e39c478'
                        return r order by r.seq_ord
                        " {} "r"))]

      (om/root
       main-view
       playback-app-state
       {:target (js/document.getElementById "playback_canvas")})


     ;(log (pr-str (first ll)))
      (doseq [item ll]
      (let [
            path      (cljs.reader/read-string (:path (into {} item )))
            content   (cljs.reader/read-string (:new_state (into {} item )))
            timestamp   (:timestamp (into {} item ))
            ]
        (log path)
        (log content)
        (log timestamp )
        (<! (timeout (-  timestamp @playbacktime)))
        (reset! playbacktime timestamp)
        (reset! playback-app-state  content)

        nil
        )
      )
    ))


(go
 (log "dd")
 (<! (timeout 1500))
 (log "dsff")
 )

(reset!
 playback-app-state
 (assoc-in
  @playback-app-state
  [:ui :request :to-full-name]
  "zubair"))






(defn replay-session [session-id]
  (go
 (let [ll  (<! (neo4j "match (n:WebSession) return n.session_id"
                      {} "n.session_id"))]

   (reset! playback-controls-state (assoc-in
                                    @playback-controls-state
                                    [:data :sessions]  (into [](take 5 ll))))
   (log ll)
   (om/root
    main-view
    playback-app-state
    {:target (js/document.getElementById "playback_canvas")})

   ))

  )




(defn playback-session-button-component [{:keys [ui data sessions]} owner]
  (reify

    om/IRender
    ;---------

    (render
     [this]
     (dom/div nil


              (dom/div
               #js {
                    :style      #js {:padding-top "40px"
                                     :background-color
                                     (if
                                       (get-in ui
                                               [:sessions data :highlighted])
                                       "lightgray"
                                       ""
                                       )
                                     }

                    :onClick    (fn [e] (replay-session  data))
                    :onMouseEnter
                    (fn[e]
                      (om/update!
                       ui
                       [:sessions data :highlighted] true )
                      )
                    :onMouseLeave
                    (fn[e]
                      (om/update!
                       ui
                       [:sessions data :highlighted] false )
                      )
                    }
               (str data)
               )
              ))))















(defn playback-controls-view [app owner]
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
     (log (str "map="(mapv
                                      (fn [x]
                                        {
                                        :ui      (-> app :ui)
                                        :data    x
                                        }
                                        )
                                      (-> app :data :sessions))))

     (dom/div nil
              (dom/h2 nil "Playback web sessions")


(apply dom/ul nil
              (om/build-all  playback-session-button-component
                                     (mapv
                                      (fn [x]
                                        {
                                        :ui      (-> app :ui)
                                        :sessions   (-> app :data :sessions)
                                        :data    x
                                        }
                                        )
                                      (-> app :data :sessions)))
                                      )


                        ))))


(go
 (let [ll  (<! (neo4j "match (n:WebSession) return n.session_id"
                      {} "n.session_id"))]

   (reset! playback-controls-state (assoc-in
                                    @playback-controls-state
                                    [:data :sessions]  (into [](take 5 ll))))
   (log ll)
   (om/root
    playback-controls-view
    playback-controls-state
    {:target (js/document.getElementById "playback_controls")})

   ))



