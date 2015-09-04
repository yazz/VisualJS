(ns webapp.framework.server.db-helper

  [:require [clojure.string :as str]]
  [:require [korma.core]]
  [:use [webapp-config.settings]]
  [:use [webapp.framework.server.encrypt]]
)







(defn to-lower-case-keys [m]
      (into (empty m) (for [[k v] m] [(keyword (.toLowerCase (name k))) v])))




(defn db-count-records [table-name]
    (:cnt
      (to-lower-case-keys
     (first
     (korma.core/exec-raw
                   [(str "SELECT COUNT(*) as CNT FROM " table-name)
                    []]
                    :results))
    )))

(defn db-table-fields [table-name]
    (keys
      (to-lower-case-keys
     (first
     (korma.core/exec-raw
                   [(str "SELECT * FROM " table-name
                         (cond
                           (= *database-type* "postgres" )
                           (str
                             " limit 1"
                             )

                           (= *database-type* "oracle" )
                           (str
                             " WHERE ROWNUM < 1"
                             )                           )
                         )
                    []]
                    :results))
    )))



(defn sql
  ([sql-in]
   (sql sql-in {}))

  ([sql-in params]
  (do
    (let [
          lower (.toLowerCase sql-in)
          ]
         ;(println "SQL from client: " sql-in)
         ;
           (cond
             (.startsWith lower "select") (do (comment println "SELECT") (into [] (map   (fn [r] (to-lower-case-keys r));
                                                                                      (korma.core/exec-raw [sql-in params] :results))))
             :else (do (comment println "INSERT") (korma.core/exec-raw [sql-in params]) [])
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
