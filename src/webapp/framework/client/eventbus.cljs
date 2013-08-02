
(ns webapp.framework.client.eventbus
    (:require
        [cljs.reader                    :as reader]

    )
   (:use
        [webapp.framework.client.coreclient      :only [popup clear add-to help remote]]
    )
   )

;(str @events)

(def events (atom []))
(defn reset-events [] (reset! events []))

(defn remove-events [event]
    (let [
          key-w     (get event :key-to-watch)
          value-w   (get event :value-to-watch)
          newe     (filter
                     #(not (and
                       (= key-w (get %1 :key-to-watch))
                       (= value-w (get %1 :value-to-watch))))
                     @events)
          newe2      (into [] newe)
          ]

      ;(.log js/console (str "before: " @events))
      (reset! events newe2)
      ;(.log js/console (str "after: " @events))
    )
)



(def event-watchers (atom []))
(defn esb-reset []
    (reset-events)
    (reset! event-watchers []))

;(count @events)
;(count @event-watchers)
;(esb-reset)





(defn match-key-and-value [key-to-watch  value-to-watch  event-watchers]
        (for [event-watcher     event-watchers]
            (let [key-matched     (get event-watcher :key-to-watch)]
                (if (and (= key-matched key-to-watch) (= value-to-watch (get event-watcher :value-to-watch)))
                    event-watcher
                )
            )
        )
  )
(comment match-key-and-value
     :name "hello"
     [
        {
           :key-to-watch    :name
           :value-to-watch  "hello"
           :fn-to-call      #(. js/console log (pr-str "event called " ))}])







(defn call-event-on-eventwatcher [event-watcher message]
  (do
      (if (event-watcher :fn-to-call)
            ((event-watcher :fn-to-call) message)
            ;(. js/console log (str event-watcher " has no fn to call" ))
      )
  )
)
(comment
  call-event-on-eventwatcher
  {:key-to-watch :name
   :value-to-watch "hello" :fn-to-call #(js/alert "called")})







(defn match-event [event-full  event-watchers]
  (let [
        event                  (event-full :message)
        keys-to-watch          (keys event)
       ]
       (for [key-to-watch  keys-to-watch]
           (if key-to-watch
             (dorun
              (map
               (fn[event-watcher]
                 (if event-watcher

                     (call-event-on-eventwatcher event-watcher
                                                 (get event-full :message) )
                   )
                 )
               (match-key-and-value  key-to-watch  (get event key-to-watch)  event-watchers)))

               ))))


(comment match-event {:message { :name "hello" :from "Zubair"}}
  [{:key-to-watch :name    :value-to-watch "hello"
    :fn-to-call #(js/alert "called") } ] )


(comment match-event
  {:message {:name "hello"}}
  [
   {:key-to-watch :name
    :value-to-watch "hello"
    :fn-to-call #(. js/console log (pr-str "event called " ))}])









(defn do-action
    [message]
    (cond

        (map? message) (swap! events conj {:message message} )
         :else         (swap! events conj {:message {:message-type message}} )
    )
)
;(esb-put {:name "hello" })

(defn to-message-defn [x]
  (cond
   (string? x)
       {
         :key-to-watch       :message-type
         :value-to-watch     x
       }
   :else
       x
  )
)
(defn receive-message-fn [message-arg  fn-to-call]

    (let
    [
       message-defn     (to-message-defn  message-arg)
    ]
        (let [ktw  (message-defn :key-to-watch)
              vtw  (message-defn :value-to-watch)]

                   (swap! event-watchers conj
                       {
                            :key-to-watch       ktw
                            :value-to-watch     vtw
                            :fn-to-call         fn-to-call
                       }))
        ;(. js/console log (pr-str event-watchers))

))
;(esb-get  :key-to-watch :name    :value-to-watch "hello" :fn-to-call #(js/alert "called"))


(defn undefine-action [message-arg]
    (let
    [
       message-defn     (to-message-defn  message-arg)
    ]
        (let [
              ktw  (message-defn :key-to-watch)
              vtw  (message-defn :value-to-watch)

              new-list-of-watchers
                  (into []
                   (map
                      #(if (not
                           (=
                             vtw
                             (get %1 :value-to-watch)
                            ))
                        %1
                        )
                    @event-watchers))
              ]
                (reset! event-watchers new-list-of-watchers)
          )

))





(add-watch events :events-change

    (fn [key a old-val new-val]
      (doall
       ;(. js/console log (pr-str "Events changed"))
       (for [event @events]
         (do
           (remove-events  event)
           ;(. js/console log (pr-str "Matching " event))
           (doall (match-event  event  @event-watchers))
)))))




(defn esb []
  (popup :title "ESB" :body-html "<div id=popup><b>list of watchers</b><div/>")
  (:value-to-watch (first @event-watchers))


  (comment doall (doseq [watcher @event-watchers]
       (add-to "popup"
              [:div {}
               (:value-to-watch watcher)]
  ))))

;(esb)