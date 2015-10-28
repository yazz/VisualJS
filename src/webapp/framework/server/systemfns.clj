(ns webapp.framework.server.systemfns

  [:require [clojure.string :as string]]
  [:use [korma.db]]
  [:use [clojure.core.async :only [go <! >!]]]
  [:require [korma.core]]
  [:use [webapp-config.settings]]
  [:use [webapp.framework.server.encrypt]]
  (:require [clojure.edn :as edn])
  (:use [clojure.pprint])
  (:import [java.util.UUID])
  [:use [webapp.framework.server.db-helper]]
  [:use [webapp.framework.server.globals]]
  (use [overtone.at-at])
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
                        :fields string/upper-case}}))


  (catch Exception e
    (str "Error connecting to database: " (.getMessage e))))












(defn dissoc-in
  "Dissociates an entry from a nested associative structure returning a new
  nested structure. keys is a sequence of keys. Any empty maps that result
  will not be present in the new structure."
  [m [k & ks :as keys]]
  (if ks
    (if-let [nextmap (get m k)]
      (let [newmap (dissoc-in nextmap ks)]
        (if (seq newmap)
          (assoc m k newmap)
          (dissoc m k)))
      m)
    (dissoc m k)))











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










(defn !get-record-pointer-locally []
  {:value *record-pointer-locally*})









(defn !get-record-ui []
  {:value *record-ui*})







(defn !get-environment []
  {:value *environment*})









(defn !get-show-debug []
  {:value *show-code*})











;----------------------------------------------------------------
(defn !create-session
  [{:keys [init-state browser]}]
  ;----------------------------------------------------------------
  (let [
        session-id         (uuid-str)
        data-session-id    (uuid-str)
        ]

    {
     :value session-id
     :data-session-id    data-session-id
    }))














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
          :db-table  db-table
          :where     where
          :start     start
          :end       end
          :params    params
          :order     order
         })















(defn get-count [db-table  where   params]
                                               (:cnt (sql-1 (str
                                                  "select count (id) as CNT from "
                                                  db-table " "
                                                  (if (-> where count pos?)
                                                    (str "where "
                                                         (first (clojure.string/split where #"order by"))
                                                         " ")
                                                    )
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
      (if end (str " limit " (+ 1 (- end start)) " ") " limit 2")
      )

     (= *database-type* "oracle" )
     ""
     )
    ) params))












(def coils-tables-trigger-version "1")










(defn keep-server-fields-up-to-date  [db-table  fields]

  (do
    (println (str "keep-server-fields-up-tp-date: " db-table  fields))
    (let [ds-fields          (get  @server-datasource-fields   db-table)
          fields-atom        (atom fields)                            ]

      (if (nil? ds-fields)
        (swap! server-datasource-fields  assoc  db-table  fields-atom)
        (let [
              fields-as-set (into #{} fields)
              existing-fields-as-set (into #{} @ds-fields)
              all-fields  (clojure.set/union   fields-as-set   existing-fields-as-set)
              all-fields-as-vector (into [] all-fields)
              ]
          (if (not (= all-fields existing-fields-as-set))
            (do
              (swap! server-datasource-fields  assoc  db-table  (atom all-fields)))))))))







(defn create-realtime-trigger [& {:keys [:table-name]}]
  (let [coils-trigger      (korma.core/exec-raw
                            [" select * from coils_triggers where table_name = ?" [table-name]]
                            :results)

        coils-trigger-exists   (pos? (count coils-trigger))

        sql-to-drop-trigger    (str "DROP TRIGGER IF EXISTS trigger_afterinsert ON " table-name ";")
        sql-to-insert-trigger-row "
        INSERT INTO coils_triggers
        (
        table_name,version
        ) values (?,?);
        "

        sql-to-create-insert-trigger (str "CREATE TRIGGER trigger_afterInsert AFTER INSERT ON " table-name " FOR EACH ROW EXECUTE PROCEDURE trigger_function_afterInsert();")
        sql-to-create-update-trigger (str "CREATE TRIGGER trigger_afterUpdate AFTER UPDATE ON " table-name " FOR EACH ROW EXECUTE PROCEDURE trigger_function_afterUpdate();")
        sql-to-create-delete-trigger (str "CREATE TRIGGER trigger_afterDelete AFTER DELETE ON " table-name " FOR EACH ROW EXECUTE PROCEDURE trigger_function_afterDelete();")
        ]
    ;(println "Coils trigger table exists: " coils-trigger-exists)


    (if (not coils-trigger-exists )
      (do
        (korma.core/exec-raw   [sql-to-insert-trigger-row [table-name  coils-tables-trigger-version]]   [])
        (korma.core/exec-raw   [sql-to-drop-trigger []]   [])
        (korma.core/exec-raw   [sql-to-create-insert-trigger []]   [])
        (korma.core/exec-raw   [sql-to-create-update-trigger []]   [])
        (korma.core/exec-raw   [sql-to-create-delete-trigger []]   [])

        )
      nil)))














(defn make-admin-table []
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
      nil)))
















(defn make-todo-table []
  (let [coils-admin-tables      (korma.core/exec-raw
                                 [" select * from pg_tables where schemaname='public' and tablename='coils_todo_items'" []]
                                 :results)

        coils-admin-table-exists   (pos? (count coils-admin-tables))

        sql-to-create-admin-table "
        CREATE TABLE coils_todo_items
        (
        id          serial NOT NULL,
        item        character varying,
        item_status character varying,

        CONSTRAINT todo_items_pkey PRIMARY KEY (id)
        );
        "
        ]

    (println "Coils todo table exists: " coils-admin-table-exists)
    (if (not coils-admin-table-exists )
      (korma.core/exec-raw   [sql-to-create-admin-table []]   [])
      nil)))
















(defn make-users-table []
  (let [coils-admin-tables      (korma.core/exec-raw
                                 [" select * from pg_tables where schemaname='public' and tablename='coils_users'" []]
                                 :results)

        coils-admin-table-exists   (pos? (count coils-admin-tables))

        sql-to-create-admin-table "
        CREATE TABLE coils_users
        (
        id serial NOT NULL,
        user_name character varying,
        CONSTRAINT users_pkey PRIMARY KEY (id)
        );
        "
        ]

    (println "Coils users table exists: " coils-admin-table-exists)
    (if (not coils-admin-table-exists )
      (korma.core/exec-raw   [sql-to-create-admin-table []]   [])
      nil)))
















(defn make-log-table []
  (let [coils-admin-tables      (korma.core/exec-raw
                                 [" select * from pg_tables where schemaname='public' and tablename='coils_realtime_log'" []]
                                 :results)

        coils-admin-table-exists   (pos? (count coils-admin-tables))

        sql-to-create-admin-table "
        CREATE TABLE coils_realtime_log
        (
        id                  serial NOT NULL,
        realtime_jvm_id     integer,
        record_timestamp    timestamp without time zone,
        record_table_name   character varying,
        record_id           character varying,
        record_operation    character varying,
        record_status       character varying
        );
        "
        ]

    (println "Coils admin table exists: " coils-admin-table-exists)
    (if (not coils-admin-table-exists )
      (korma.core/exec-raw   [sql-to-create-admin-table []]   [])
      nil
      )))


















(defn make-log-table-insert-trigger-function []
  (let [coils-trigger-fn-exists-result      (korma.core/exec-raw
                                             ["select exists(select * from pg_proc where proname = 'trigger_function_afterinsert');" []]
                                             :results)

        coils-trigger-fn-exists   (= "t"  coils-trigger-fn-exists-result)

        sql-to-create-trigger-fn "
        CREATE OR REPLACE FUNCTION trigger_function_afterInsert()
        RETURNS trigger AS
        $BODY$
        BEGIN
        INSERT INTO coils_realtime_log
        (record_timestamp,  record_table_name,  record_id,  record_operation,  record_status)
        VALUES
        ( now(),   TG_TABLE_NAME ,  NEW.id,  'INSERT',  'WAITING');
        RETURN NULL;
        END;
        $BODY$
        LANGUAGE plpgsql;
        "
        ]

    ;(println "Coils trigger function exists: " coils-trigger-fn-exists)
    (if (not coils-trigger-fn-exists )
      (korma.core/exec-raw   [sql-to-create-trigger-fn []]   [])
      nil)))



















(defn make-log-table-update-trigger-function []
  (let [coils-trigger-fn-exists-result      (korma.core/exec-raw
                                             ["select exists(select * from pg_proc where proname = 'trigger_function_afterUpdate');" []]
                                             :results)

        coils-trigger-fn-exists   (= "t"  coils-trigger-fn-exists-result)

        sql-to-create-trigger-fn "
        CREATE OR REPLACE FUNCTION trigger_function_afterUpdate()
        RETURNS trigger AS
        $BODY$
        BEGIN
        INSERT INTO coils_realtime_log
        (record_timestamp,  record_table_name,  record_id,  record_operation,  record_status)
        VALUES
        ( now(),   TG_TABLE_NAME ,  NEW.id,  'UPDATE',  'WAITING');
        RETURN NULL;
        END;
        $BODY$
        LANGUAGE plpgsql;
        "
        ]

    ;(println "Coils trigger function exists: " coils-trigger-fn-exists)
    (if (not coils-trigger-fn-exists )
      (korma.core/exec-raw   [sql-to-create-trigger-fn []]   [])
      nil)))















(defn make-log-table-delete-trigger-function []
  (let [coils-trigger-fn-exists-result      (korma.core/exec-raw
                                             ["select exists(select * from pg_proc where proname = 'trigger_function_afterDelete');" []]
                                             :results)

        coils-trigger-fn-exists   (= "t"  coils-trigger-fn-exists-result)

        sql-to-create-trigger-fn "
        CREATE OR REPLACE FUNCTION trigger_function_afterDelete()
        RETURNS trigger AS
        $BODY$
        BEGIN
        INSERT INTO coils_realtime_log
        (record_timestamp,  record_table_name,  record_id,  record_operation,  record_status)
        VALUES
        ( now(),   TG_TABLE_NAME ,  OLD.id,  'DELETE',  'WAITING');
        RETURN NULL;
        END;
        $BODY$
        LANGUAGE plpgsql;
        "
        ]

    ;(println "Coils trigger function exists: " coils-trigger-fn-exists)
    (if (not coils-trigger-fn-exists )
      (korma.core/exec-raw   [sql-to-create-trigger-fn []]   [])
      nil)))












(make-todo-table)
(make-users-table)
(make-admin-table )
(make-log-table   )

(make-log-table-insert-trigger-function)
(make-log-table-update-trigger-function)
(make-log-table-delete-trigger-function)









(defn do-real [& {:keys [:table-name]}]
  ;(println "table name: " table-name)

  (create-realtime-trigger  :table-name  table-name))





(defn get-record-from-server-cache-for-id  [db-table   id]
  (let [table-atom     (get @server-side-cached-records  db-table)
        record-atom    (if table-atom (get @table-atom  id))
        ]
    (do
      (if record-atom  @record-atom nil))))





(defn get-table-from-server-cache-for-table  [db-table  ]
  (let [table-atom     (get @server-side-cached-records  db-table)
        ]
    (do
      (if table-atom  table-atom nil))))











(defn create-cache-for-table  [db-table]
  (let [table-atom (get @server-side-cached-records  db-table)
        ]
    (do
      (if (nil? table-atom)
        (swap! server-side-cached-records assoc db-table (atom {}))))))









(defn get-record-from-database [db-table id fields]

  (let [sql (str
             "select " (fields-to-str fields) " from " db-table " where id = ? "
             (cond
              (= *database-type* "postgres" )
              " limit 1"

              (= *database-type* "oracle" )
              ""))
        ]
    (do
      ;(println "SQL::: " sql "," id)
      (sql-1  sql [id])
      )))










(defn delete-record-from-realtime-update  [ table-name    record-id     data-session-id ]
  (let [client-data-atom         (if server-side-realtime-clients  (get @server-side-realtime-clients  data-session-id))
        response-atom            (if client-data-atom  client-data-atom )
        update-request-atom      (if response-atom  (get @response-atom :update-request ))
        update-request           (if update-request-atom  @update-request-atom)
        ]
    (println (str "      update-request: " update-request))
    (swap! update-request-atom  dissoc-in  [:records table-name record-id])
  ))


















(defn get-record [db-table  id  fields  realtime client-id]
  (if id
    (do

      ; if a realtime record
      (if realtime
        (do
          (create-cache-for-table  db-table)
          (keep-server-fields-up-to-date   db-table  fields)
          (let [cached-record     (get-record-from-server-cache-for-id  db-table   id)]
            (if (not cached-record)
              (let [record           (get-record-from-database    db-table id fields)
                    table            (get-table-from-server-cache-for-table    db-table)
                    query-time       (quot (System/currentTimeMillis) 1000)
                    ]
                (if table
                  (let [
                        new-clients-atom    (atom #{client-id})
                        ]
                     (swap!  table assoc id (atom {:value record :timestamp query-time :clients new-clients-atom}))
                   )
                  nil
                  ))


                  (let [
                        clients-atom        (get cached-record :clients)
                        ]
                    (swap!  clients-atom  conj  client-id)
                    )



              ))))


      ; get the record
      (let [cached-record     (get-record-from-server-cache-for-id  db-table   id)]
        (if (not cached-record)
          (get-record-from-database    db-table id fields)
          (do
            (delete-record-from-realtime-update  db-table    id     client-id)
            ;(println "Use cached value " id ":" cached-record)
            (get cached-record :value)
            )
          )))))









(defn !get-record-result
  [{:keys [
           db-table
           id
           fields
           data-session-id
           realtime
           ]}]
      ;(println (str " !get-record-result DATA_SESSION_ID: " data-session-id))
      ;(println (str " !get-record-result realtime: " realtime))
  {:value
   (get-record   db-table  id  fields  realtime  data-session-id)})











(defn next-realtime-id [] (swap! server-side-realtime-counter inc))








(defn get-fields-for-table   [db-table]
    (println (pr-str "get-fields-for-table: " db-table))
  (let [fields-atom          (get @server-datasource-fields  db-table)
        fields-entry         (if fields-atom (into [] @fields-atom))   ]

    (println (pr-str "Read fields: " fields-entry))

    (if fields-entry
      fields-entry)))





; ----------------------------------------------------------------
; This is called whenever there has been an update of a realtime
; query.
; ----------------------------------------------------------------
(defn update-record-in-cache [db-table  id]
  (do
    (println "Update record")
    (let [
          cached-record    (get-record-from-server-cache-for-id  db-table   id)
          fields           (get-fields-for-table   db-table)
          record           (get-record-from-database    db-table id fields)
          table            (get-table-from-server-cache-for-table    db-table)
          query-time       (quot (System/currentTimeMillis) 1000)
          clients          (get cached-record :clients)
          ]
      (do
        (create-cache-for-table   db-table)
        ;(println (str "Value before: "  (get-record-from-server-cache-for-id  db-table  id )))
        (if table
          (swap!  table assoc id (atom {:value record :timestamp query-time :clients clients}))
          nil)
        ;(println (str "Value after: "  (get-record-from-server-cache-for-id  db-table  id )))
        ))))










(defn inform-clients-about-record  [db-table   id]
  ;(println "inform-clients-about-record ")
  (let [the-record        (get-record-from-server-cache-for-id  db-table  id )
        clients-atom      (:clients the-record)
        ]
    ;(println (str "    the-record: " the-record))
    ;(println (str "    Record Clients: " @clients-atom))

    (doall (for [client @clients-atom]
             (do
               ;(println (str "    Client: " client))
               (let [the-client       (get @server-side-realtime-clients  client)
                     response-atom    (:update-request @the-client)
                     ]
                 (if (not response-atom) (swap! response-atom assoc  :update-request (atom {})))
                 (swap! (:update-request @the-client) assoc-in [:records db-table id] {:timestamp (get the-record :timestamp)})
                 ;(println (str "    responses: " (if response-atom @response-atom)))

                 ;                   (swap! (:update-request @the-query) assoc  1 2)
                 ))))
    nil
    ))









; ----------------------------------------------------------------
; This is called whenever there has been an update of a realtime
; query.
; ----------------------------------------------------------------
(defn update-query-in-cache [query]
  (let [
        record-count       (get-count   (get query :db-table)  (get query :where)   (get query :params))



        results            (get-results    :db-table (get query :db-table)
                                           :where    (get query :where)
                                           :order    (get query :order)
                                           :start    (get query :start)
                                           :end      (get query :end)
                                           :params   (get query :params)
                                           )

        result-id-vector   (into [] (map :id results))

        existing-query     (get @server-side-cached-queries   query)

        query-time         (quot (System/currentTimeMillis) 1000)
        ]
    (do
      ;(println (str "    " ))
      ;(println (str "    update-query-in-cache" ))
      ;(println (str "    " query))

      (if (not existing-query)
        (swap! server-side-cached-queries assoc  query (atom {:clients  (atom #{})})))



      (let [the-query        (get @server-side-cached-queries   query)
            clients-atom     (:clients @the-query)


            ]
        (swap! the-query assoc  :records       result-id-vector)
        (swap! the-query assoc  :count         record-count)
        (swap! the-query assoc  :timestamp     query-time)

        ;(println (str "    clients: " @clients-atom))
        (doall (for [client @clients-atom]
                 (do
                   ;(println (str "    Client: " client))
                   (let [the-client       (get @server-side-realtime-clients  client)
                         response-atom    (:update-request @the-client)
                         ]
                     (if (not response-atom) (swap! the-query assoc  :update-request (atom {})))
                     (swap! (:update-request @the-client) assoc-in [:queries query] {:timestamp query-time})
                     ;(println (str "    responses: " (if response-atom @response-atom)))

                     ;                   (swap! (:update-request @the-query) assoc  1 2)
                     ))))))))














; ----------------------------------------------------------------
; When the client application running in the web browser needs to be
; updated in real time then the server needs to know which
; SQL queries belong to which client so that it can update them
; ----------------------------------------------------------------
(defn add-client-to-query [query  client-id]
  (let [
        existing-query     (get @server-side-cached-queries   query)
        existing-clients   (get @existing-query  :clients)

        client-queries     (get @(get @server-side-realtime-clients   client-id) :queries)
        this-query         (get @client-queries query)
        ]
    (do
      ; if the query does not know about the client then tell it
      (swap! existing-clients conj client-id)

      ; if the client does not know about this query then tell it
      (if (not this-query)
        (swap! client-queries   assoc  query {}))

      ;(println "")
      ;(println "  add-client-to-query")
      ;(println (str "    " @server-side-realtime-clients))
      ;(println "")

      )))
















(defn parse-id [s]
  (let [find-num (re-find  #"\d+" s )]
    (if find-num
      (Integer. find-num)
      s)))



; ----------------------------------------------------------------
; Whenever a record changes an entry is added to the real time log
; which is processed here. It first finds which queries it
; belongs to and then changes
; ----------------------------------------------------------------
(defn process-log-entry [ realtime-log-entry ]

  (let [
        id               (parse-id  (get realtime-log-entry :record_id))
        db-table         (get realtime-log-entry :record_table_name)
        ]
    ;(println (str "**** Processing realtime record change: "))
    ;(println (str "      "  "realtime-log-entry"))
    ;(println (str "      "  realtime-log-entry))
    ;(println (str "      "))
    ;(println (str "      "  "@server-side-cached-queries"))
    ;(println (str "      "  @server-side-cached-queries))
    ;(println (str "      "))
    ;(println (str "Count: " (-> @server-side-cached-queries keys count str)))



    ; ----------------------------------------------------------------
    ; If this is a record update, so update the internal record
    ; cache
    ; ----------------------------------------------------------------
    (if (= (get realtime-log-entry :record_operation) "UPDATE")
      (do
        (update-record-in-cache  db-table   id)
        (inform-clients-about-record   db-table   id)))



    ; ----------------------------------------------------------------
    ; First we make sure that any queries which access the same
    ; table as the record that changed are checked
    ; ----------------------------------------------------------------
    (let [queries (keys @server-side-cached-queries)]
      (doall (for [query queries]
               (do
                 (if (= (get query :db-table)   db-table)
                   (do
                     ;(println (str "    "))
                     ;(println (str "    " "Query"))
                     ;(println (str "    " query))
                     ;(println (str "    "))

                     ;(println (str "    " "Before"))
                     ;(println (str "    " @(get @server-side-cached-queries query)))
                     ;(println (str "    "))
                     ;(println (str "    " @(:clients @(get @server-side-cached-queries query))))

                     (update-query-in-cache  query)

                     ;(println (str "    "))
                     ;(println (str "    " "After"))
                     ;(println (str "    " @(get @server-side-cached-queries query)))
                     ;(println (str "    "))
                     ;(println (str "    " @(:clients @(get @server-side-cached-queries query))))
                     ;(println (str "    "))

                     ;(println (str "clients:"))
                     ;(println (str "    " (keys @server-side-realtime-clients)))
                     ;(println (str "    "))
                     ))))))




    ))


















; ----------------------------------------------------------------
;
; ----------------------------------------------------------------
(defn create-client-cache [client-realtime-id]
  (let [client-cache     (get @server-side-realtime-clients  client-realtime-id)
        ]
    (if (nil? client-cache)
      (swap! server-side-realtime-clients assoc client-realtime-id (atom {:queries (atom {})    :records (atom {})    :update-request (atom {})})))))







(defn delete-query-from-realtime-update  [ query-key     data-session-id ]
  (let [client-data-atom         (if server-side-realtime-clients  (get @server-side-realtime-clients  data-session-id))
        response-atom            (if client-data-atom  client-data-atom )
        update-request-atom      (if response-atom  (get @response-atom :update-request ))
        update-request           (if update-request-atom  @update-request-atom)
        ]
    (println (str "      update-request: " update-request))
    (swap! update-request-atom dissoc-in [:queries query-key])
  ))


















; ----------------------------------------------------------------
; Whenever the web browser asks the server for data it calls
; this function (!get-query-results) telling the server
; which client it is via the 'data-session-id' ID.
; ----------------------------------------------------------------
(defn !get-query-results [{:keys [
                                     db-table
                                     where
                                     start
                                     end
                                     params
                                     order
                                     realtime
                                     data-session-id
                                     ]}]

  ;(println "************************************************************************************")
  ;(println "    **** " db-table " : "  fields)
  ;(println " ")
  ;(println "!get-query-results*   REALTIME = " realtime)
  (comment println (str "!get-query-results: "
                db-table
                where " "
                start  " "
                end " "
                params " "
                order " "
                data-session-id " "
                realtime " "
                ))
  ;(println "************************************************************************************")
  ;(println "     data-session-id: " data-session-id)






  (cond
   ; ----------------------------------------------------------------
   ; if this is a realtime query
   ; ----------------------------------------------------------------
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
     (create-client-cache  data-session-id)
     (delete-query-from-realtime-update  query-key data-session-id)

     (if (get @server-side-cached-queries  query-key)
       nil
       (do
         (update-query-in-cache  query-key)))

     (add-client-to-query  query-key  data-session-id)

     (do-real   :table-name db-table)

     ;(println "-------------------------------")
     ;(println "SERVER @server-side-cached-queries     " @server-side-cached-queries)
     ;(println query-key)
     ;(println @(get @server-side-cached-queries  query-key))
     ;(println "-------------------------------")

     (let [result   @(get @server-side-cached-queries  query-key)]
       {
        :records    (:records result)
        :count      (:count result)
        :timestamp  (:timestamp result)
        } ))




   ; ----------------------------------------------------------------
   ; if this is a normal query
   ; ----------------------------------------------------------------
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
        :count        record-count
        }
       ))))





















; ----------------------------------------------------------------
; Whenever a database record changes it get processed here on the
; server
; ----------------------------------------------------------------
(go
  (loop []
    (do
        (let [realtime-log-entry   (<! server-side-record-changes)]
            (process-log-entry  realtime-log-entry ))
        (recur))))














; ----------------------------------------------------------------
; On the server check every 1 second for record changes on the
; database. If a record changes then send the log entry details to
; the channel 'server-side-record-changes'
; ----------------------------------------------------------------
(def my-pool (mk-pool))
(every 500 (fn []
              (let [next-id                           (next-realtime-id)

                    sql                               (str "update coils_realtime_log"
                                                           "      set record_status = 'PROCESSING',"
                                                           "          realtime_jvm_id = ? "
                                                           "where "
                                                           "      id in ( SELECT "
                                                           "                    id"
                                                           "              FROM "
                                                           "                    coils_realtime_log"
                                                           "              WHERE "
                                                           "                   record_status='WAITING' LIMIT 1 ) "
                                                           )

                    get-realtime-log-entry            (str "select * from coils_realtime_log "
                                                           "WHERE "
                                                           "realtime_jvm_id = ?")

                    how-many-records-have-changed?    (first  (korma.core/exec-raw [sql [next-id]] []))
                    ]
                (do
                  ;(println "SERVER: How many real time records have changed? " how-many-records-have-changed? )
                  (if (pos? how-many-records-have-changed?)
                    (do
                      (let [realtime-log-entry-list     (korma.core/exec-raw [get-realtime-log-entry [next-id]] :results)
                            realtime-log-entry          (first realtime-log-entry-list)
                            ]
                        (go
                         (if realtime-log-entry
                           (>! server-side-record-changes  realtime-log-entry)))
                        )))))) my-pool)
















; ----------------------------------------------------------------
; Whenever a web client wants to know if the data it is showing
; needs to be updated it sends a request to this server side
; function
; ----------------------------------------------------------------
(defn !check-for-server-updates [{:keys [
                                     client-data-session-id
                                     ]}
                                 ]

  (let [client-data-atom    (if server-side-realtime-clients  (get @server-side-realtime-clients  client-data-session-id))
        response-atom       (if client-data-atom  client-data-atom )
        ]
    ;(println (str "      " ))
    ;(println "SERVER: check-for-server-updates for client: " client-data-session-id)
    ;(println (str "      " (keys @server-side-realtime-clients)))
    ;(println (str "      " (if client-data-atom  @client-data-atom)))
    ;(println (str "      response: " (if response-atom  @(get @response-atom :update-request )  )))
    (if response-atom  @(get @response-atom :update-request )  {})))




































