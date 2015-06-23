(ns webapp.framework.server.db-helper

  [:require [clojure.string :as str]]
  [:require [korma.core]]
  [:use [webapp-config.settings]]
  [:use [webapp.framework.server.encrypt]]
  (:require [clojurewerkz.neocons.rest :as nr])
  (:require [clojurewerkz.neocons.rest.nodes :as nn])
  (:require [clojurewerkz.neocons.rest.relationships :as nrl])
  (:require [clojurewerkz.neocons.rest.cypher :as cy])
)


(defn db-count-records [table-name]
    (:count
     (first
     (korma.core/exec-raw
                   [(str "SELECT count(*) FROM " table-name)
                    []]
                    :results)
    )))

(defn db-table-fields [table-name]
    (keys
     (first
     (korma.core/exec-raw
                   [(str "SELECT * FROM " table-name " limit 1")
                    []]
                    :results)
    )))



(defn sql
  ([sql-in]
   (sql sql-in {}))

  ([sql-in params]
  (do
    (let [
          lower           (.toLowerCase sql-in)
          ]
      ;(println "SQL from client: " sql-in)
      (cond
       (.startsWith lower "select")  (do (comment println "SELECT") (korma.core/exec-raw [sql-in params] :results))
       :else                         (do (comment println "INSERT") (korma.core/exec-raw [sql-in params]) [])
   ; []
    )))
  )
)

(defn sql-1
  ([sql-in]
   (first (sql  sql-in)))

  ([sql-in params]
   (first (sql  sql-in params)))
)

(defn uuid []
 (java.util.UUID/randomUUID))

(defn uuid-str []
 (str (java.util.UUID/randomUUID)))
