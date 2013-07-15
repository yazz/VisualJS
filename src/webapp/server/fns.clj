(ns webapp.server.fns
  [:require [clojure.string :as str]]
  [:use [korma.db]]
  [:use [korma.core]]
)


(defdb db (postgres {:db "webdb"
                     :host "127.0.0.1"
                     :user "postgres"
                     :password "manager"}))




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