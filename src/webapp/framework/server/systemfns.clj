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


(defn !sql [{sql :sql params :params}]
  (do
    (println "encryptor: " encryptor)
   (println "SQL from client: " sql " -> " )
   (println "SQL from server: " (encrypt "SELECT * FROM test_table where name = ?") " -> " )
   (exec-raw [(decrypt sql) params] :results)
   ; []
  )
)

