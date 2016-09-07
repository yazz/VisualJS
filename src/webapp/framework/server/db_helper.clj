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
                             " WHERE ROWNUM <= 1"
                             )                           )
                         )
                    []]
                    :results))
    )))





(defn sql
  ([sql-in]
   (sql sql-in {}))

  ([sql-in  params]
   (sql nil sql-in params))


  ([schema  sql-in  params]
   (let [
          lower             (.toLowerCase sql-in)
          returns-results?  (or (.startsWith lower "select")  (.contains lower "returning"))
          update-only?      (not returns-results?)
          use-schema        (cond
                              (or (= schema "public") (nil? schema))      "public"
                              :else                                        schema)
          ]

     (cond
       returns-results?
       ;---------------
       (let [res     (korma.db/transaction
                       (korma.core/exec-raw [(str "set schema '" use-schema "'") []])
                       (korma.core/exec-raw [sql-in params] :results))

             formatted   (into [] (map   (fn [r] (to-lower-case-keys r)) res))
             ]
         (korma.core/exec-raw [(str "set schema 'public'") []])
         formatted)




       update-only?
       ;-----------
       (do

         (korma.db/transaction
           (korma.core/exec-raw [(str "set schema '" use-schema "'") []])
           (korma.core/exec-raw [sql-in params])
           (korma.core/exec-raw [(str "set schema 'public'") []]))
         [])

       ))))




(defn sql-1
  ([sql-in]
   (first (sql  sql-in)))

  ([sql-in params]
   (first (sql  sql-in params)))

  ([schema sql-in params]
   (first (sql  schema sql-in params)))
)

(defn uuid []
 (java.util.UUID/randomUUID))

(defn uuid-str []
 (str (java.util.UUID/randomUUID)))









(defn does-table-exist
  ([schema-name  table-name]
   (let [table-exists-result      (korma.core/exec-raw
                                    [(cond
                                       (= *database-type* "postgres" )
                                       (str "select * from pg_tables where schemaname='" schema-name "' and tablename=?")
                                       (= *database-type* "oracle" )
                                       "select count(*) from all_objects   where object_type in ('TABLE','VIEW')   and object_name =?"
                                       ) [(cond (= *database-type* "postgres" ) table-name (= *database-type* "oracle" ) (.toUpperCase table-name))]]
                                    :results)

         table-exists?   (cond
                           (= *database-type* "postgres" )
                           (> (count table-exists-result) 0)

                           (= *database-type* "oracle" )
                           (> (first (vals (first table-exists-result)  )) 0))
         ]

     ;(println (str table-name " table-exists-result: " (count table-exists-result)))
     (println (str table-name " table exists: " table-exists?))
     table-exists?))

  ([table-name]
   (does-table-exist  "public"  table-name)
   )

  )


