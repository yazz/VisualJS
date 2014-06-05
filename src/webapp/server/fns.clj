(ns webapp.server.fns
  [:require [clojure.string :as str]]
  [:use [korma.db]]
  [:use [webapp.framework.server.systemfns]]
  [:use [webapp.framework.server.email-service]]
  [:use [webapp.framework.server.encrypt]]
  [:use [korma.core]]
  [:use [clojure.repl]]
  [:use [webapp.framework.server.db-helper]]
  [:use [webapp.framework.server.globals]]
  [:use [webapp.framework.server.neo4j-helper]]

  (:use [webapp-config.settings])
  (:use [overtone.at-at])
  (:import [java.util.UUID])
  (:import [java.util TimerTask Timer])
  (:require [webapp.ignore.test-data])
)


(def my-pool (mk-pool))








(defn process-ask-for-endorsement [send-endorsement-neo4j-node]
  (if send-endorsement-neo4j-node
    (let
      [
       confirm-sender-code    (uuid-str)
       ]

      (send-email
       :message      (str "ConnectToUs.co - "
                          (:from_full_name  send-endorsement-neo4j-node)
                          ", please confirm your endorsement request by clicking "
                          "here:\r\n\r\n"
                          *web-server* "/*" confirm-sender-code)

       :subject      (str "ConnectToUs.co - "
                          (:from_full_name  send-endorsement-neo4j-node)
                          ", please confirm your endorsement request" )

       :from-email   "contact@connecttous.co"
       :from-name    "ConnectToUs.co"
       :to-email     (:from_email send-endorsement-neo4j-node)
       :to-name      (:from_full_name  send-endorsement-neo4j-node)
       )

      (neo4j "match n where id(n)={id}
             remove n:AskForEndorsement
             set n:AskForEndorsementConfirmSender,
             n.confirm_sender_code = {confirm_sender_code}
             return n"
             {
              :id                   (:neo-id send-endorsement-neo4j-node)
              :confirm_sender_code  confirm-sender-code
              } "n")
      )

    ))





(defn process-ask-for-endorsement-ask-receiver [send-endorsement-neo4j-node]
  (if send-endorsement-neo4j-node
    (let
      [
       confirm-receiver-code    (uuid-str)
       ]

      (send-email
       :message      (str "ConnectToUs.co - "
                          (:to_full_name  send-endorsement-neo4j-node)
                          "Your company X have been endorsed Y by Z, from your friend "
                          (:from_full_name  send-endorsement-neo4j-node)
                          ", please confirm your endorsement request by clicking "
                          "here:\r\n\r\n"
                          *web-server* "/*" confirm-receiver-code)

       :subject      (str "ConnectToUs.co - "
                          (:from_full_name  send-endorsement-neo4j-node)
                          ", please confirm your endorsement request" )

       :from-email   "contact@connecttous.co"
       :from-name    "ConnectToUs.co"
       :to-email     (:to_email send-endorsement-neo4j-node)
       :to-name      (:to_full_name  send-endorsement-neo4j-node)
       )

      (neo4j "match n where id(n)={id}
             remove n:AskForEndorsementContactReceiver
             set n:AskForEndorsementWaitingOnReceiver,
             n.confirm_receiver_code = {confirm_receiver_code}
             return n"
             {
              :id                   (:neo-id send-endorsement-neo4j-node)
              :confirm_receiver_code  confirm-receiver-code
              } "n")
      )

    ))







(defn check-messages []
  (let [messages-waiting (neo4j "match (n:AskForEndorsement) return n" {} "n")]
    (dorun (map process-ask-for-endorsement  messages-waiting)))

  (let [messages-waiting (neo4j "match (n:AskForEndorsementContactReceiver) return n" {} "n")]
    (dorun (map process-ask-for-endorsement-ask-receiver  messages-waiting)))


  )



(stop-and-reset-pool! my-pool)



(def a (atom 0))

(add-init-fn
 (fn[]
   (do
     (future
       (stop-and-reset-pool! my-pool)
       (every 5000
              #(do
                 (swap! a inc)
                 (check-messages)
                 ;(println @a)
                 )

              my-pool))
     "********* Loaded background task **********")))




(defn create-session[{:keys [init-state browser]}]
  (let [
        session-id    (uuid-str)
        ]

    (neo4j "create  (n:WebSession
                    {
                            session_id:           {session_id},
                            init_state:           {init_state},
                            start_time:           {start_time},
                            browser:              {browser}

                            }) return n"

           {
            :session_id    session-id
            :init_state    init-state
            :browser       browser
            :start_time    (. (java.util.Date.) getTime)
           }
           "n")
    {:value session-id}
    ))






(defn clear-playback-sessions [{:keys [password]}]
  (if (= password "use the source luke")
    (do
      (neo4j "MATCH (n:WebSession) OPTIONAL MATCH (n)-[r]-(s) DELETE n,r,s")
      {:result "done" :success true}
      )
    {:success false}

    ))


(defn add-history [{:keys [session-id  history-order  timestamp  path new-value]}]
    ;(println (str "** history-order "    history-order))
    ;(println (str "** path "             path))
    ;(println (str "** new-value "        new-value))
    ;(println (str "** timestamp "        timestamp))
    ;(println (str "** session "          session-id))

    (let [session  (first (neo4j "match (n:WebSession)
                                 where n.session_id={si}
                                 return n " {:si session-id} "n"))
          ]
      (if session
        (let [

              web-record        (first (neo4j "create  (n:WebRecord
                                              {
                                              session_id:           {session_id},
                                              seq_ord:              {seq_ord},
                                              path:                 {path},
                                              new_value:            {new_value},
                                              timestamp:            {timestamp}
                                              }) return n"
                                              {
                                               :session_id  session-id
                                               :seq_ord     history-order
                                               :path        (str path)
                                               :new_value   (str new-value)
                                               :timestamp   timestamp
                                               }
                                              "n"))
              ]
          (do
            ;(println session)
            ;(println web-record)
            (neo4j "START n=node(*), m=node(*)
                   where id(n)={ws} and id(m)={wr}
                   create (n)-[:FRIENDSHIP {status:2}]->(m)
                   " {:ws (:neo-id session) :wr (:neo-id web-record)})

            []
            )

          )
        []
        )))


(defn request-endorsement [{:keys [from-full-name
                                   from-email
                                   to-full-name
                                   to-email
                                   endorsement
                                   ]}]
  (let [
        endorsement-id    (uuid-str)
        web-record        (first (neo4j "create  (n:AskForEndorsement
                                        {
                                        endorsement_id:       {endorsement_id},
                                        from_email:           {from_email},
                                        to_email:             {to_email},
                                        from_full_name:       {from_full_name},
                                        to_full_name:         {to_full_name},
                                        endorsement:          {endorsement},
                                        timestamp:            {timestamp}
                                        }) return n"
                                        {
                                         :endorsement_id  endorsement-id
                                         :from_email      from-email
                                         :to_email        to-email
                                         :from_full_name  from-full-name
                                         :to_full_name    to-full-name
                                         :endorsement     endorsement
                                         :timestamp       "timestamp"
                                         }
                                        "n"))
        ]
    web-record)
  )


(comment println (request-endorsement {:from-full-name "1"
                                   :from-email  "1"
                                   :to-full-name "1"
                                   :to-email "1"
                                   :endorsement "1"
                                   }))



(defn confirm-sender-code [{:keys [sender-code]}]

   (let [n   (neo4j "match (n:AskForEndorsementConfirmSender)
                     where n.confirm_sender_code = {confirm_sender_code}
                     return n"
             {
              :confirm_sender_code  sender-code
              } "n")]
     (if (= (count n) 0)
         {:error "Session doesn't exist"}

       (do
          (neo4j "match n where
                 n.confirm_sender_code = {sender_code}

               remove n:AskForEndorsementConfirmSender
               set n:AskForEndorsementContactReceiver
               return n"
               {
                :sender_code  sender-code
                } "n")
         {:value "Sesson exists"}
        )
       )
  )
)


(defn sender-confirmed [{:keys [endorsement-id]}]

   (let [n   (neo4j "match n
                     where n.endorsement_id = {endorsement_id} and
                    (n:AskForEndorsementContactReceiver OR
                     n:AskForEndorsementWaitingOnReceiver)
                     return n"
             {
              :endorsement_id  endorsement-id
              } "n")]
     (if (= (count n) 0)
         {:value false}
         {:value true}
       )))




(defn confirm-receiver-code [{:keys [receiver-code]}]

   (let [n   (neo4j "match (n:AskForEndorsementWaitingOnReceiver)
                     where n.confirm_receiver_code = {confirm_receiver_code}
                     return n"
             {
              :confirm_receiver_code  receiver-code
              } "n")]
     (if (= (count n) 0)
         {:error "Session doesn't exist"}

       (do
          (neo4j "match n where
                 n.confirm_receiver_code = {receiver_code}

               remove n:AskForEndorsementWaitingOnReceiver
               set n:AskForEndorsementCompleted
               return n"
               {
                :receiver_code  receiver-code
                } "n")
         {:value "Sesson exists"}
        )
       )
  )
)


(defn receiver-confirmed [{:keys [endorsement-id]}]

   (let [n   (neo4j "match (n:AskForEndorsementCompleted)
                     where n.endorsement_id = {endorsement_id}
                     return n"
             {
              :endorsement_id  endorsement-id
              } "n")]
     (if (= (count n) 0)
         {:value false}
         {:value true}
       )))

(comment sender-confirmed {:endorsement-id
       "4a64e240-e7ec-44db-a322-5245e35e0492"})
