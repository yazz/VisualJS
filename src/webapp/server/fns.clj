(ns webapp.server.fns
  [:require [clojure.string :as str]]
  [:use [korma.db]]
  [:use [webapp.framework.server.systemfns]]
  [:use [webapp.framework.server.email-service]]
  [:use [webapp.framework.server.encrypt]]
  [:use [korma.core]]
  [:use [clojure.repl]]
  [:use [webapp.framework.server.db-helper]]
  [:use [webapp.framework.server.neo4j-helper]]

  (:use [webapp-config.settings])
  (:use [overtone.at-at])
  (:import [java.util.UUID])
  (:import [java.util TimerTask Timer]))



(def my-pool (mk-pool))








(defn process-ask-for-endorsement [send-endorsement-neo4j-node]
  (if send-endorsement-neo4j-node
    (do
      (send-email
       :message      "hi zubair"
       :subject      "subject test"
       :from-email   (:from send-endorsement-neo4j-node)
       :from-name    "zubair"
       :to-email     (:to send-endorsement-neo4j-node)
       :to-name      "zubairq")
      (neo4j "match n where id(n)={id}
             remove n:AskForEndorsement
             set n:SendEndorsementConfirmFrom
             return n"
             {:id (:neo-id send-endorsement-neo4j-node)} "n")
      )

    ))






(defn check-messages []
  (let [messages-waiting (neo4j "match (n:AskForEndorsement) return n" {} "n")]
    (dorun (map process-ask-for-endorsement  messages-waiting))
    ))


(stop-and-reset-pool! my-pool)



;(def a (atom 0))
(comment do
  (stop-and-reset-pool! my-pool)
  (every 5000
         #(do
            (swap! a inc)
            (check-messages)
            ;(println @a)
            )

         my-pool))




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






(defn clear-playback-sessions [{}]
  (do
    (neo4j "MATCH (n:WebSession) OPTIONAL MATCH (n)-[r]-(s) DELETE n,r,s")
    {:result "done"}
))


(defn add-history [{:keys [session-id  history-order  timestamp  path new-value]}]
    (println (str "** history-order "    history-order))
    (println (str "** path "             path))
    (println (str "** new-value "        new-value))
    (println (str "** timestamp "        timestamp))
    (println (str "** session "          session-id))

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
            (println session)
            (println web-record)
            (neo4j "START n=node(*), m=node(*)
                   where id(n)={ws} and id(m)={wr}
                   create (n)-[:FRIENDSHIP {status:2}]->(m)
                   " {:ws (:neo-id session) :wr (:neo-id web-record)})

            []
            )

          )
        []
        )))





