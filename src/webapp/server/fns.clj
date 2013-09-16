(ns webapp.server.fns
  [:require [clojure.string :as str]]
  [:use [korma.db]]
  [:use [webapp.framework.server.systemfns]]
  [:use [webapp.framework.server.email-service]]
  [:use [webapp.framework.server.encrypt]]
  [:use [korma.core]]
  [:use [clojure.core.async]]
  [:use [clojure.repl]]

  (:require [clojurewerkz.neocons.rest :as nr])
  (:require [clojurewerkz.neocons.rest.nodes :as nn])
  (:require [clojurewerkz.neocons.rest.relationships :as nrl])
  (:require [clojurewerkz.neocons.rest.cypher :as cy])
  (:use [webapp-config.settings])
  (:import [java.util.UUID])
)

( try
     (nr/connect! "http://localhost:7474/db/data/")
         (catch Exception e (str "caught exception: " (.getMessage e))))



(defentity test_table)



(defn test-call
  "Tests to see if the server was called ok"
  [params]
  (get-in params [:a :d ]))



(defn get-db-data [params]
  (select test_table))

;(get-db-data nil)

(comment insert test_table
  (values [{:id          (java.util.UUID/randomUUID)
            :name        "shopping"
            :description "Get the beef"
           }]))

(comment select test_table)

(defn say-hello [params]
    {:value (into []
[])})


(defn get-environment [params]
  {:value *environment*}
)

(defn get-show-debug [params]
  {:value *show-code*}
)



(comment let [ch (chan)]
  (go (while true
        (let [v (<! ch)]
          (println "Read: " v))))
  (go (>! ch "hi")
      (<! (timeout 5))
      (>! ch "there")))


(defn add-user [{user-name :user-name password :password}]
  user-name
)




;(add-user {:user-name "zubair"})

(defn get-from-neo [params]
    {:value (into []
         (let [amy (nn/create {:username "amy" :age 27})
                bob (nn/create {:username "bob" :age 28})
                _   (nrl/create amy bob :friend {:source "college"})
                res (cy/tquery "START x = node({ids}) RETURN x.username, x.age" {:ids (map :id [amy bob])})]
            res)
          )})


;(get-from-neo nil)












   (defonce neo4j-type-index
     ( try
     (nn/create-index "types")
         (catch Exception e (str "caught exception: " (.getMessage e))))
 )



   (defn to-nodes4j [results]
        (into []
           (map
             #(get %1 "resultset")
             results)))


   (defn to-maps4j [results]
        (into []
           (map
             #(:data (get %1 "resultset"))
             results)))


   (defn table4j [table-name]
     (to-maps4j
         (cy/tquery "START resultset=node:types('type:*') where resultset.type={type} RETURN resultset"
                    {:type table-name})))



   (defn nodes4j [table-name]
     (to-nodes4j
         (cy/tquery "START resultset=node:types('type:*') where resultset.type={type} RETURN resultset"
                    {:type table-name})))




   (defn make4j [node]
      (if (:type node)
         (let [
                 node     (nn/create node)
              ]
              (nn/add-to-index (:id node)  (:name neo4j-type-index) "type" (:type node))
         )
         (throw (new java.lang.Exception "needs a type"))
      )
   )



   ;(make4j {:type "place" :name "Moscow"})



   ;(table4j "place")

   ;(nodes4j "place")


(defn find-user-by-username [{username :username}]
          (let [r (exec-raw
               ["SELECT id, user_name FROM users where user_name = ?"
                [username]]
                :results)]

            (first r)
            )
)



;(find-user-by-username {:username "zq@nemcv.com2"})

(defn send-password [{email :email}]
    (println "fn email:" email)
    (let [user (find-user-by-username  {:username email})
         request-id (str (java.util.UUID/randomUUID))]
      (if user
        (do
            (exec-raw
                 ["insert into password_reset_requests (fk_user_id, status, request_id) values (?, ?, ?)"
                  [(:id user)
                   "sent"
                   request-id]])

            (send-email
                  :message    (str
                                 "Please reset your password by clicking here:"
                                 *database-server*
                                 "/main.html?request_id="
                                 request-id
                              )
                  :subject    "Coils.cc reset password request"
                  :from-email "help@coils.cc"
                  :to-email   email
            )
            {:status :sent})


        {:status :doesnt-exist}
      )
    )
)

;(send-password {:email "zq@nemcv.com"})

(defn login-user [{username :username password :password}]
            (exec-raw
               ["SELECT id, user_name, password FROM users where user_name = ? and password = ?"
                [username password]]
                :results)
)

;(login-user {:username "z" :password "s"})

(comment let [amy (nn/create {:username "amy"})
        bob (nn/create {:username "bob"})
        _   (nrl/create amy bob :friend {:source "college"})]
    (println (nrl/incoming-for bob :types [:friend])))
