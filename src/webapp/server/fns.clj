(ns webapp.server.fns
  [:require [clojure.string :as str]]
  [:use [korma.db]]
  [:use [webapp.framework.server.systemfns]]
  [:use [korma.core]]
  [:use [clojure.core.async]]
)



(defentity test_table)



(defn test-call [params]
  (get-in params [:a :d ]))



(defn get-db-data [params]
  (select test_table))

;(get-db-data nil)

(comment insert test_table
  (values [{:id          (java.util.UUID/randomUUID)
            :name        "shopping"
            :description "Get the milk"
           }]))

(comment select test_table)

(defn say-hello [params]
    {:text (str "Hello " (:name params))}
)



(comment let [ch (chan)]
  (go (while true
        (let [v (<! ch)]
          (println "Read: " v))))
  (go (>! ch "hi")
      (<! (timeout 5))
      (>! ch "there")))