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
  (:import [java.util TimerTask Timer])
)

(def my-pool (mk-pool))

(def a (atom 0))


;(neo4j "MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r")

(defn process-send-endorsement [send-endorsement-neo4j-node]
  (if send-endorsement-neo4j-node
    (do
      (send-email
       :message      "hi zubair"
       :subject      "subject test"
       :from-email   "zubairq@gmail.com"
       :from-name    "zubair"
       :to-email     "zubairq@gmail.com"
       :to-name      "zubairq")
      (neo4j "match n where id(n)={id}
             remove n:SendEndorsement
             set n:SendEndorsementConfirmFrom
             return n"
             {:id (:neo-id send-endorsement-neo4j-node)} "n")
      )

    ))





(neo4j "match (n:SendEndorsement) return count(n)")

(process-send-endorsement
(first (neo4j "match (n:SendEndorsement) return n" {} "n")))

(:neo-id (first (neo4j "match (n:SendEndorsement) return n" {} "n")))




(defn check-messages []
  (let [messages-waiting (neo4j "match (n:SendEndorsement) return count(n)" {})]
    (println messages-waiting)))


(stop-and-reset-pool! my-pool)

(do
  (stop-and-reset-pool! my-pool)
  (every 5000
         #(do
            (swap! a inc)
            (check-messages)
            )

         my-pool))

