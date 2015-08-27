(ns webapp.framework.server.systemfns

  [:require [clojure.string :as string]]
  [:use [korma.db]]
  [:require [korma.core]]
  [:use [webapp-config.settings]]
  [:use [webapp.framework.server.encrypt]]
  [:require [webapp.framework.server.neo4j-helper :as nh]]
  (:require [clojurewerkz.neocons.rest :as nr])
  (:require [clojurewerkz.neocons.rest.nodes :as nn])
  (:require [clojurewerkz.neocons.rest.relationships :as nrl])
  (:require [clojurewerkz.neocons.rest.cypher :as cy])
  (:require [clojure.edn :as edn])
  (:use [clojure.pprint])
  (:import [java.util.UUID])
  [:use [webapp.framework.server.db-helper]]
  [:use [webapp.framework.server.neo4j-helper]]
  [:use [webapp.framework.server.globals]]
  )


(try
  (cond
    (= *database-type* "postgres" )
        (defdb db (postgres {:db *database-name*
                         :host *database-server*
                         :user *database-user*
                         :password *database-password*}))

    (= *database-type* "oracle" )
        (defdb db {:classname "oracle.jdbc.driver.OracleDriver"
               :subprotocol "oracle"
               :subname (str "thin:@"  *database-server*  ":1521:" *database-name*)
               :user *database-user*
               :password *database-password*
               :naming {:keys string/upper-case
                        :fields string/upper-case}})
    )






  (catch Exception e
    (str "Error connecting to database: " (.getMessage e))))







(defn !say-hello [params]
    {:text (str "System Hello " (:name params))})






(defn !sql [{coded-sql :sql params :params}]
  (do
    (let [sql             (decrypt coded-sql)
          lower           (.toLowerCase sql)
          ]
      ;(println "SQL from client: " coded-sql " -> " sql)
      (cond
       (.startsWith lower "select")  (do (comment println "SELECT") (korma.core/exec-raw [sql params] :results))
       :else                         (do (comment println "INSERT") (korma.core/exec-raw [sql params]) [])
    ))))





(defn !neo4j [{coded-cypher :cypher params :params}]
  (do
    (let [cypher          (decrypt coded-cypher)
          ]
          ;(println "Cypher from client: " coded-cypher " -> " cypher)
          (nh/neo4j  cypher  params)
    )))
;(!neo4j {:cypher (encrypt "match n return count(n)") :params {} })








(defn !neo4j_nodes [{coded-cypher :cypher
                     params       :params
                     return       :return}]
  (do
    (let [cypher          (decrypt coded-cypher)
          lower           (.toLowerCase cypher)
          ]
      ;(println "Cypher from client: " coded-cypher " -> " cypher)
      (nh/neo4j   cypher  params  return)
    )))


(comment !neo4j_nodes {:cypher (encrypt
                         "create (u:User { email : { email2 }, title : 'Developer' }) return u")
               :params {:email2 "zubairq@gmail.com"}
               :return "u"})









(defn !count-all-neo4j-records-with-field [ {field-name :field-name} ]
      (cy/tquery (str "START x = node(*) WHERE HAS(x." field-name ") RETURN count(x)") {} )
)







(defn !get-all-neo4j-records-with-field [ {field-name :field-name} ]
      (cy/tquery (str "START x = node(*) WHERE HAS(x." field-name ") RETURN x,ID(x)") {} )
)

;(!get-all-neo4j-records-with-field {:field-name "type"})







(defn !add-to-simple-point-layer   [{node :node layer-name :layer-name}]
  (nh/add-to-simple-layer (:name node) (:x node) (:y node) layer-name))




(comment
  !add-to-simple-point-layer {:node           {:name "Lib2" :x 0.1 :y 0.1}
                              :layer-name     "ore2"})




(defn !find-names-within-distance [{x :x y :y dist-km :dist-km layer-name :layer-name}]
  (nh/find-names-within-distance layer-name x y dist-km))





(defn !find-names-within-bounds [{
                                  min-x :min-x
                                  min-y :min-y
                                  max-x :max-x
                                  max-y :max-y
                                  layer-name :layer-name}]
  (nh/find-names-within-bounds layer-name min-x max-x min-y max-y))





(defn !get-record-pointer-locally []
  {:value *record-pointer-locally*})





(defn !get-record-ui []
  {:value *record-ui*})




(defn !get-environment []
  {:value *environment*})





(defn !get-show-debug []
  {:value *show-code*})




(comment !find-names-within-bounds
 {:layer-name "ore2"
  :min-x 0.0 :max-x 1.1 :min-y 50.0 :max-y 51.5})


;(!find-names-within-distance {:layer-name "ore2" :x 0 :y 0 :dist-km 1000})






(comment !neo4j {
         :cypher   (encrypt "START x = node(11) RETURN x")
         :params   {}})

               ;:params   {:ids (map :id [bob])}}))







(defn !add-history [{:keys [session-id  history-order  timestamp  path new-value]}]
    ;(println (str "** history-order "    history-order))
    ;(println (str "** path "             path))
    ;(println (str "** new-value "        new-value))
    ;(println (str "** timestamp "        timestamp))
    ;(println (str "** session "          session-id))

    (let [session  (first (nh/neo4j "match (n:WebSession)
                                 where n.session_id={si}
                                 return n " {:si session-id} "n"))
          ]
      (if session
        (let [

              web-record        (first (nh/neo4j "create  (n:WebRecord
                                              {
                                              session_id:           {session_id},
                                              seq_ord:              {seq_ord},
                                              path:                 {path},
                                              new_value:            {new_value},
                                              timestamp:            {timestamp}
                                              }) return n"
                                              {
                                               :session_id  session-id
                                               :seq_ord     history-order
                                               :path        (str path)
                                               :new_value   (str new-value)
                                               :timestamp   timestamp
                                               }
                                              "n"))
              ]
          (do
            ;(println session)
            ;(println web-record)
            (nh/neo4j "match n, m
                   where id(n)={ws} and id(m)={wr}
                   create (n)-[:SAVED]->(m)
                   " {:ws (:neo-id session) :wr (:neo-id web-record)})

            []
            )

          )
        []
        )))





;----------------------------------------------------------------
(defn !create-session
  [{:keys [init-state browser]}]
  ;----------------------------------------------------------------
  (let [
        session-id         (uuid-str)
        data-session-id    (uuid-str)
        ]
    (if *record-ui*

      (nh/neo4j "create  (n:WebSession
                {
                session_id:           {session_id},
                init_state:           {init_state},
                start_time:           {start_time},
                browser:              {browser}

                }) return n"

                {
                 :session_id    session-id
                 :init_state    init-state
                 :browser       browser
                 :start_time    (. (java.util.Date.) getTime)
                 }
                "n")
      {
        :value              session-id
       }
      )
    {
     :value session-id
     :data-session-id    data-session-id
    }
    ))







(defn !clear-playback-sessions
  [{:keys [password]}]
  ;----------------------------------------------------------------

  (if (= password "use the source luke")
    (do
      (neo4j "MATCH (n:WebSession) OPTIONAL MATCH (n)-[r]-(s) DELETE n,r,s")
      {:result "done" :success true}
      )
    {:success false}

    ))


(defn !make-sql
  [{:keys [
           fields
           db-table
           where
           ]}]

  (sql
   (str
    "select "
         fields " "
    "from "
         db-table " "
    (cond
      (= *database-type* "postgres" )
        (if where (str "where " where " "))

      (= *database-type* "oracle" )
        (if where (str "where " where " "))
    )
    ;questions_answered_count is not null
    ;order by
    ;questions_answered_count desc"
      (cond
        (= *database-type* "postgres" )
        "limit 100"

        (= *database-type* "oracle" )
        ""
          )
    ) {}))







(defn fields-to-str [fields]
  (apply str (interpose "," (map (-> name ) fields) )))











(defn create-query-key [& {:keys [
                                   db-table
                                   where
                                   start
                                   end
                                   params
                                   order
                                   ]}]
         {
          :db-table db-table
          :where where
          :start start
          :end end
          :params params
          :order order
         })




(defn get-count [db-table  where   params]
                                               (:cnt (sql-1 (str
                                                  "select count (id) as CNT from "
                                                  db-table " "
                                                  (if (-> where count pos?) (str "where " where " "))
                                                  )
                                                 params)))





(defn get-results [& {:keys [db-table where order start end params]}]
(sql
    (str
        "select id from "
        db-table " "
        (if (-> where count pos?) (str "where " where " "))
        (if (-> order count pos?) (str "order by " order " "))
        (cond
            (= *database-type* "postgres" )
            (str
                (if start (str " offset " (- start 1) " "))
                (if end (str " limit " (+ 1 (- end start)) " ") "limit 2")
                )

            (= *database-type* "oracle" )
            ""
            )

        ;questions_answered_count is not null
        ;order by
        ;questions_answered_count desc"
        ) params)
        )








(def coils-tables-trigger-version "1")



(defn create-realtime-trigger [& {:keys [:table-name]}]
(let [coils-trigger      (korma.core/exec-raw 
                                   [" select * from coils_triggers where table_name = ?" [table-name]] 
                                   :results)

        coils-trigger-exists   (pos? (count coils-trigger))

        sql-to-create-trigger "
INSERT INTO coils_triggers
(
  table_name,version
) values (?,?);
"
        ]
        (println "Coils trigger table exists: " coils-trigger-exists)


        (if (not coils-trigger-exists )
                      (korma.core/exec-raw   [sql-to-create-trigger [table-name  coils-tables-trigger-version]]   [])
                      nil
        )

          )
)


(defn do-real [& {:keys [:table-name]}]
  (let [coils-admin-tables      (korma.core/exec-raw 
                                   [" select * from pg_tables where schemaname='public' and tablename='coils_triggers'" []] 
                                   :results)

        coils-admin-table-exists   (pos? (count coils-admin-tables))

        sql-to-create-admin-table "
CREATE TABLE coils_triggers
(
  id serial NOT NULL,
  table_name character varying,
  version character varying
);
"
  ]

      (println "Coils admin table exists: " coils-admin-table-exists)
      (if (not coils-admin-table-exists )
                      (korma.core/exec-raw   [sql-to-create-admin-table []]   [])
                      nil
        )




            (println "table name: " table-name)
            (create-realtime-trigger :table-name table-name)

  )
  )









(defn !get-query-results-v2 [{:keys [
                                     db-table
                          		       where
                                     start
                                     end
                                     params
                                     order
                                     realtime
                                     data-session-id
                          		   ]}]

  (println "************************************************************************************")
  (println "!get-query-results-v2*   REALTIME = " realtime)
  (println (str "!get-query-results-v2: "
                db-table
                where " "
                start  " "
                end " "
                params " "
                order " "
                data-session-id " "
                realtime " "
                ))
  (println "************************************************************************************")

  (cond
       realtime
       
       (let [
             query-key   (create-query-key
                            :db-table  db-table
                            :where     where
                            :start     start
                            :end       end
                            :params    params
                            :order     order)
             ]

           (if (get @cached-queries  query-key)
               nil
               (let [
                     record-count       (get-count   db-table  where   params)



                     results            (get-results    :db-table db-table
                                                        :where    where
                                                        :order    order
                                                        :start    start
                                                        :end      end
                                                        :params   params
                                                        )

                     result-id-vector   (into [] (map :id results))
                    ]
                      (swap! cached-queries assoc  query-key {
                                                               :records      result-id-vector
                                                               :count        record-count
                                                                  })
              )

           )

          (do-real   :table-name db-table)

          (println "-------------------------------")
          (println "@cached-queries     " @cached-queries)
          (println query-key)
          (println (get @cached-queries  query-key))
          (println "-------------------------------")

           (get @cached-queries  query-key)
      )



      :else

      (do
          (let [
                 record-count      (get-count   db-table  where   params)



        results

       (get-results   :db-table db-table
                      :where    where
                      :order    order
                      :start    start
                      :end      end
                      :params   params
        )

		result-id-vector
		(into [] (map :id results))
		]

    ;(println result-id-vector)
    {
     :records      result-id-vector
      :count       record-count
     }
    ))))

















(defn !get-record-result-v2
  [{:keys [
           db-table
           id
           fields
           data-session-id
           ]}]
      ;(println (str " !get-record-result-v2 DATA_SESSION_ID: " data-session-id))
  {:value
   (sql-1
    (str
     "select "
     (fields-to-str fields) " "
     "from "
     db-table " "
     "where id = ? "
     (cond
       (= *database-type* "postgres" )
       " limit 1"

       (= *database-type* "oracle" )
       ""
       )


     ) [id])})



;(sql-1 "select count(id) from table_name " [])


