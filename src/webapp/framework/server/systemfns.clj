(ns webapp.framework.server.systemfns

  [:require [clojure.string :as str]]
  [:use [korma.db]]
  [:use [korma.core]]
  [:use [webapp.framework.server.encrypt]]
)


(defdb db (postgres {:db "webdb"
                     :host "127.0.0.1"
                     :user "postgres"
                     :password "manager"}))




(defn !say-hello [params]
    {:text (str "System Hello " (:name params))}
)


(defn !sql [{coded-sql :sql params :params}]
  (do
    (let [sql             (decrypt coded-sql)
          lower           (.toLowerCase sql)
          ]
      (println "SQL from client: " coded-sql " -> " sql)
      (cond
       (.startsWith lower "select")  (do (println "SELECT") (exec-raw [sql params] :results))
       :else                         (do (println "INSERT") (exec-raw [sql params]) [])
   ; []
    ))
  )
)




