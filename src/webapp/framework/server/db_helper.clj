(ns webapp.framework.server.db-helper

  [:require [clojure.string :as str]]
  [:require [korma.core]]
  [:use [webapp-config.settings]]
  [:use [webapp.framework.server.encrypt]]
  (:require [clojure.java.jdbc :as j])
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
   (do
     (let [
            lower (.toLowerCase sql-in)
            ]
       ;(println "SQL from client: " sql-in)
       ;
       (cond
         (or (.startsWith lower "select")  (.contains lower "returning"))
         (do (into [] (map   (fn [r] (to-lower-case-keys r));
                             (korma.core/exec-raw [sql-in params] :results))))

         :else
         (do (comment println "INSERT") (korma.core/exec-raw [sql-in params]) [])
         ; []
         )))
   )

  ([schema  sql-in  params]
   (do
     (cond
       (or (= schema "public") (nil? schema))
       (let [
              lower (.toLowerCase sql-in)
              ]
         (cond
           (or (.startsWith lower "select")  (.contains lower "returning"))
           (do  (into [] (map   (fn [r] (to-lower-case-keys r));
                                (korma.core/exec-raw [sql-in params] :results))))

           :else (do (comment println "INSERT") (korma.core/exec-raw [sql-in params]) [])
           ; []
           ))



       :else
       (let [
              jdbc-conn        (cond
                                 (= *database-type* "postgres" )
                                 (. java.sql.DriverManager getConnection  (str "jdbc:postgresql://" *database-server* ":5432/" *database-name*)  *database-user*  *database-password*)

                                 (= *database-type* "oracle" )
                                 (. java.sql.DriverManager getConnection  (str "jdbc:oracle:thin:" *database-user* "/" *database-password* "@" *database-server* ":1521:" *database-name*)  *database-user*  *database-password*))

              statement    (. jdbc-conn createStatement)

              change-schema   (. statement execute  (str "set schema '" schema "'"))
              res             (. statement executeQuery  sql-in)
              outrows         (into [] (j/result-set-seq res))
              ]

         (if outrows
           (do
             (. statement close)
             (. jdbc-conn close)
             outrows
             )))
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









(defn does-table-exist [table-name]
  (let [table-exists-result      (korma.core/exec-raw
                                   [(cond
                                      (= *database-type* "postgres" )
                                      "select * from pg_tables where schemaname='public' and tablename=?"
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
