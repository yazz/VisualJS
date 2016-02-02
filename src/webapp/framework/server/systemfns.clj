(ns webapp.framework.server.systemfns

  [:require [clojure.string :as string]]
  (:require [clojure.java.io :as io])
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
  (:require [me.raynes.fs    :as fs])
  (:require [me.raynes.conch])
  (:require [me.raynes.conch.low-level])
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
                        :fields string/upper-case}
                   }))


  (catch Exception e
    (str "Error connecting to database: " (.getMessage e))))




(Class/forName "oracle.jdbc.driver.OracleDriver")
(Class/forName "org.postgresql.Driver")



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






(defn !get-main-background-color []
  {:value *main-background-color*})




(defn !get-main-text-color []
  {:value *main-text-color*})







(defn !get-record-ui []
  {:value *record-ui*})



(defn !get-appshare-dev-server []
  {:value *appshare-dev-server*})

(defn !get-appshare-dev-port []
  {:value *base-dev-port*})


(defn !get-appshare-cljs-source []
  {:value *appshare-cljs-source*})



(defn !get-environment []
  {:value *environment*})









(defn !get-show-debug []
  {:value *show-code*})











;----------------------------------------------------------------
(defn !create-session
  [{:keys [init-state     browser    session-id-from-browser]}]
  ;----------------------------------------------------------------
  (let [
         web-session-in-db    (if session-id-from-browser (sql-1 "select   id, session_id, fk_appshare_user_id   from    appshare_web_sessions     where session_id = ?"   [session-id-from-browser]))
         session-id           (if (get web-session-in-db :session_id)

                                (get web-session-in-db :session_id)

                                (let [new-uuid (uuid-str)]
                                  (do
                                    (sql-1 "insert into appshare_web_sessions (session_id) values (?)"   [new-uuid])
                                    new-uuid)))
         data-session-id      (uuid-str)
         user-id              (get web-session-in-db :fk_appshare_user_id)
         user                 (if user-id (sql-1 "select id, user_name from appshare_users  where id=?" [user-id]))
        ]
    (do
      (println (str "!create-session: " session-id-from-browser))
      {
        :session-id         session-id
        :data-session-id    data-session-id
        :user               user
        })))














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















(defn    get-count    [db-table  where   params]

  (do
    (println (str "db-table: " db-table))
    (println (str "where: " where))
    (println (str "params: " params))

    (:cnt (sql-1 (str
                  "select count (id) as CNT from "
                  db-table " "
                  (if (-> where count pos?)
                    (str "where "
                         (first (clojure.string/split where #"order by"))
                         " ")
                    )
                  )
                 params))))














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
     "")
     ) params))









(def coils-tables-trigger-version "1")




(defn clear-server-table-caches-for  [db-table]
  (swap! server-side-cached-records assoc db-table (atom {}))
  )










(defn keep-server-fields-up-to-date  [db-table  fields]

  (do
    ;(println (str "keep-server-fields-up-tp-date: " db-table  fields))
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
          (if (not (= all-fields  existing-fields-as-set))
            (do
              (println (str "     " existing-fields-as-set " -> " all-fields))
              (swap! server-datasource-fields  assoc  db-table  (atom all-fields))
              (clear-server-table-caches-for  db-table)
              )))))))







(defn create-realtime-trigger [& {:keys [:table-name]}]
  (let [coils-trigger      (korma.core/exec-raw
                            [" select * from appshare_triggers where table_name = ?" [table-name]]
                            :results)

        coils-trigger-exists   (pos? (count coils-trigger))

        sql-to-insert-trigger-row
        (cond
          (= *database-type* "postgres")
          "INSERT INTO appshare_triggers (table_name,version) values (?,?);"

          (= *database-type* "oracle")
          "INSERT INTO appshare_triggers (table_name,version) values (?,?)")





        sql-to-create-insert-trigger
        (cond
          (= *database-type* "postgres")
          (str "CREATE TRIGGER trigger_afterInsert AFTER INSERT ON " table-name " FOR EACH ROW EXECUTE PROCEDURE trigger_function_afterInsert();")

          (= *database-type* "oracle")
          (str "create or replace trigger I" table-name " AFTER INSERT ON " table-name " "
                                " FOR EACH ROW "
                                   "BEGIN "
                                   "INSERT INTO appshare_realtime_log  (record_timestamp, record_table_name, record_id, record_id_type, record_operation) "
                                   "values \n"
                                   "(LOCALTIMESTAMP, '" table-name "', :NEW.id, "
                                   " (SELECT data_type FROM user_tab_columns WHERE table_name = 'APPSHARE_TODO_ITEMS' AND column_name = 'ID') , "
                                   " 'INSERT'); "
                                   "END;"
               ))






        sql-to-create-update-trigger
        (cond
          (= *database-type* "postgres")
          (str "CREATE TRIGGER trigger_afterUpdate AFTER UPDATE ON " table-name " FOR EACH ROW EXECUTE PROCEDURE trigger_function_afterUpdate();")

          (= *database-type* "oracle")
          (str "create or replace trigger U" table-name " AFTER UPDATE ON " table-name " "
                                " FOR EACH ROW "
                                   "BEGIN "
                                   "INSERT INTO appshare_realtime_log  (record_timestamp, record_table_name, record_id, record_id_type, record_operation) "
                                   "values \n"
                                   "(LOCALTIMESTAMP, '" table-name "', :NEW.id, "
                                   " (SELECT data_type FROM user_tab_columns WHERE table_name = 'APPSHARE_TODO_ITEMS' AND column_name = 'ID') , "
                                   " 'UPDATE'); "
                                   "END;"
               ))

        sql-to-create-delete-trigger
        (cond
          (= *database-type* "postgres")
          (str "CREATE TRIGGER trigger_afterDelete AFTER DELETE ON " table-name " FOR EACH ROW EXECUTE PROCEDURE trigger_function_afterDelete();")

          (= *database-type* "oracle")
          (str "create or replace trigger D" table-name " AFTER DELETE ON " table-name " "
                                " FOR EACH ROW "
                                   "BEGIN "
                                   "INSERT INTO appshare_realtime_log  (record_timestamp, record_table_name, record_id, record_id_type, record_operation) "
                                   "values \n"
                                   "(LOCALTIMESTAMP, '" table-name "', :OLD.id, "
                                   " (SELECT data_type FROM user_tab_columns WHERE table_name = 'APPSHARE_TODO_ITEMS' AND column_name = 'ID') , "
                                   " 'DELETE'); "
                                   "END;"
               ))

        ]
    ;(println "Coils trigger table exists: " coils-trigger-exists)
    ;(println "sql-to-create-insert-trigger: " sql-to-create-insert-trigger)


    (if (not coils-trigger-exists)
      (let [
             jdbc-conn        (cond
                                (= *database-type* "postgres" )
                                (. java.sql.DriverManager getConnection  (str "jdbc:postgresql://" *database-server* ":5432/" *database-name*)  *database-user*  *database-password*)

                                (= *database-type* "oracle" )
                                (. java.sql.DriverManager getConnection  (str "jdbc:oracle:thin:" *database-user* "/" *database-password* "@" *database-server* ":1521:" *database-name*)  *database-user*  *database-password*))
             statement    (. jdbc-conn createStatement)

             ]
        (. statement execute  sql-to-create-insert-trigger)
        (. statement execute  sql-to-create-update-trigger)
        (. statement execute  sql-to-create-delete-trigger)
        (. statement close)
        (. jdbc-conn close)

        (korma.core/exec-raw   [sql-to-insert-trigger-row [table-name  coils-tables-trigger-version]])
        )
      nil)))












(defn make-triggers-table []
  (let [sql-to-create-triggers-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE appshare_triggers
          (
          id         serial NOT NULL,
          table_name character varying,
          version    character varying,
          CONSTRAINT appshare_triggers_pkey PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_triggers
          (
          id                 NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          table_name         VARCHAR2(200 BYTE),
          version            VARCHAR2(200 BYTE),
          CONSTRAINT  APPSHARE_TRIGGERS_PK PRIMARY KEY (ID)
          )"
          )
        ]

    (if (not (does-table-exist  "appshare_triggers"))
      (korma.core/exec-raw   [sql-to-create-triggers-table []]   [])
      nil)))
















(defn make-todo-table []
  (let [sql-to-create-todo-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE appshare_todo_items
          (
          id                   serial NOT NULL,
          item                 character varying,
          item_status          character varying,
          CONSTRAINT appshare_todo_items_pkey PRIMARY KEY (id)
          );"

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_todo_items
          (id                 NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          ITEM                VARCHAR2(200 BYTE),
          ITEM_STATUS         VARCHAR2(200 BYTE),
          CONSTRAINT  APPSHARE_TODO_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_todo_items"))
      (korma.core/exec-raw   [sql-to-create-todo-table []]   [])
      nil)))



















(defn make-publishers-table []
  (let [sql-to-create-publishers-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE appshare_publishers
          (
          id                   serial NOT NULL,
          publisher_name       character varying,
          CONSTRAINT appshare_publishers_pkey PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_publishers
          (
          id                 NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          publisher_name     VARCHAR2(200 BYTE),
          CONSTRAINT  APPSHARE_PUBLISHERS_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_publishers"))
      (korma.core/exec-raw   [sql-to-create-publishers-table []]   [])
      nil)))






(defn make-web-sessions-table []
  (let [sql-to-create-web-sessions-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE appshare_web_sessions
          (
          id                        serial NOT NULL,
          fk_appshare_user_id       integer,
          session_id                character varying,
          CONSTRAINT appshare_web_sessions_pkey PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_web_sessions
          (
          id                        NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          fk_appshare_user_id       integer,
          session_id                VARCHAR2(200 BYTE),
          CONSTRAINT  APPSHARE_WEB_SESSIONS_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_web_sessions"))
      (korma.core/exec-raw   [sql-to-create-web-sessions-table []]   [])
      nil)))









(defn make-users-publisers-table []
  (let [sql-to-create-users-publsihers-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE appshare_users_publishers
          (
          id                        serial NOT NULL,
          fk_appshare_user_id       integer,
          fk_appshare_publisher_id  integer,
          default_publisher         character varying,
          CONSTRAINT appshare_users_publishers_pkey PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_users_publishers
          (
          id                        NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          fk_appshare_user_id       integer,
          fk_appshare_publisher_id  NUMBER,
          default_publisher         VARCHAR2(10 BYTE),
          CONSTRAINT  APPSHARE_USERS_PUBLISHERS_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_users_publishers"))
      (korma.core/exec-raw   [sql-to-create-users-publsihers-table []]   [])
      nil)))






(defn make-users-table []
  (let [sql-to-create-users-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE appshare_users
          (
          id                        serial NOT NULL,
          user_name                 character varying,
          CONSTRAINT appshare_users_pkey PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_users
          (
          id                        NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          user_name                 VARCHAR2(200 BYTE),
          CONSTRAINT  APPSHARE_USERS_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_users"))
      (korma.core/exec-raw   [sql-to-create-users-table []]   [])
      nil)))











(defn make-logins-table []
  (let [sql-to-create-logins-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE appshare_logins
          (
          id                   serial NOT NULL,
          login_type           character varying,
          login_user_name      character varying,
          login_email          character varying,
          login_password       character varying,
          fk_appshare_user_id  integer,
          CONSTRAINT appshare_logins_pkey PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_logins
          (
          id                   NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          login_type           VARCHAR2(200 BYTE),
          login_user_name      VARCHAR2(200 BYTE),
          login_email          VARCHAR2(200 BYTE),
          login_password       VARCHAR2(200 BYTE),
          fk_appshare_user_id  NUMBER,
          CONSTRAINT  APPSHARE_LOGINS_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_logins"))
      (korma.core/exec-raw   [sql-to-create-logins-table []]   [])
      nil)))












;(defn-ui-component     main-to-do-app   [app] {} (div nil "demo"))
(defn make-applications-table []
  (let [sql-to-create-applications-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE appshare_applications
          (
          id                        serial NOT NULL,
          application_name          character varying,
          application_code          character varying,
          application_glyph         character varying,
          fk_appshare_publisher_id  integer,
          CONSTRAINT appshare_applications_users_pkey PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_applications
          (
          id                        NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          application_name          VARCHAR2(200 BYTE),
          application_glyph         VARCHAR2(200 BYTE),
          application_code          CLOB,
          fk_appshare_publisher_id  NUMBER,
          CONSTRAINT  APPSHARE_APPLICATIONS_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_applications"))
      (korma.core/exec-raw   [sql-to-create-applications-table []]   [])
      nil)))







(defn make-figwheel-table []
  (let [sql-to-create-figwheel-processes-table
        (cond
          (= *database-type* "postgres")
          "
          CREATE TABLE appshare_figwheel_processes
          (
          id                           serial NOT NULL,
          figwheel_port                integer,
          figwheel_status              character varying,
          figwheel_client_data_id      character varying,
          CONSTRAINT appshare_figwheel_processes_pkey PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle")
          "
          CREATE TABLE appshare_figwheel_processes
          (
          id                           NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          figwheel_port                NUMBER,
          FIGWHEEL_STATUS              VARCHAR2(200 BYTE),
          figwheel_client_data_id      VARCHAR2(200 BYTE),
          CONSTRAINT  APPSHARE_FIGWHEEL_PROCESSES_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_figwheel_processes"))
      (korma.core/exec-raw   [sql-to-create-figwheel-processes-table []]   [])
      nil)))












(defn make-log-table []
  (let [sql-to-create-admin-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE appshare_realtime_log
          (
          id                  serial NOT NULL,
          record_timestamp    timestamp(3),
          record_table_schema character varying,
          record_table_name   character varying,
          record_id           character varying,
          record_id_type      character varying,
          record_operation    character varying,
          CONSTRAINT appshare_realtime_log_pkey PRIMARY KEY (id)
          );
          "
          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_realtime_log
          (
          id                  NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          record_timestamp    TIMESTAMP,
          record_table_schema VARCHAR2(200 BYTE),
          record_table_name   VARCHAR2(200 BYTE),
          record_id           VARCHAR2(200 BYTE),
          record_id_type      VARCHAR2(200 BYTE),
          record_operation    VARCHAR2(200 BYTE),
          CONSTRAINT  APPSHARE_REALTIME_LOG_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_realtime_log"))
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
        INSERT INTO appshare_realtime_log
        (record_timestamp,  record_table_schema, record_table_name,  record_id, record_id_type, record_operation)
        VALUES
        ( now(),   TG_TABLE_SCHEMA , TG_TABLE_NAME ,  NEW.id,
        (select data_type from information_schema.columns where column_name='id' and table_name = TG_TABLE_NAME),
        'INSERT');
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
        INSERT INTO appshare_realtime_log
        (record_timestamp,  record_table_schema, record_table_name,  record_id, record_id_type,  record_operation)
        VALUES
        ( now(),   TG_TABLE_SCHEMA ,TG_TABLE_NAME ,  NEW.id,
        (select data_type from information_schema.columns where column_name='id' and table_name = TG_TABLE_NAME),
        'UPDATE');
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
        INSERT INTO appshare_realtime_log
        (record_timestamp,  record_table_schema, record_table_name,  record_id, record_id_type,  record_operation)
        VALUES
        ( now(),   TG_TABLE_SCHEMA, TG_TABLE_NAME ,  OLD.id,
        (select data_type from information_schema.columns where column_name='id' and table_name = TG_TABLE_NAME),
        'DELETE');
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












(make-web-sessions-table)
(make-todo-table)
(make-publishers-table)
(make-users-table)
(make-users-publisers-table)
(make-logins-table)
(make-applications-table)
(make-triggers-table)
(make-log-table)
(make-figwheel-table)

(cond
  (= *database-type* "postgres" )
  (do
    (make-log-table-insert-trigger-function)
    (make-log-table-update-trigger-function)
    (make-log-table-delete-trigger-function)))








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
      (println "SQL::: " sql "," id , ":fields:" fields)
      (sql-1  sql [id])
      )))










(defn delete-record-from-realtime-update  [ table-name    record-id     data-session-id ]
  (do
    (println (str "delete-record-from-realtime-update: " ))
    (println (str "              table-name: "       table-name))
    (println (str "              record-id: "        record-id))
    (println (str "              data-session-id: "  data-session-id))

  (let [client-data-atom         (if server-side-realtime-clients  (get @server-side-realtime-clients  data-session-id))
        response-atom            (if client-data-atom  client-data-atom )
        update-request-atom      (if response-atom  (get @response-atom :update-request ))
        update-request           (if update-request-atom  @update-request-atom)
        ]
    ;(println (str "      update-request: " update-request))
    (if update-request-atom
      (swap! update-request-atom  dissoc-in  [:records table-name record-id])
      ))))

















(defn get-record [db-table  id  fields  realtime client-id]
  (if id
    (do

      ;(println (str "get-record: " db-table ":"  id ":" fields))

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
                ;(println (str "record:     " record))
                ;(println (str "table:      " table))
                ;(println (str "query-time: " query-time))
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
















(defn get-fields-for-table   [db-table]
    (println (pr-str "get-fields-for-table: " db-table))
  (let [fields-atom          (get @server-datasource-fields  db-table)
        fields-entry         (if fields-atom (into [] @fields-atom))   ]

    (println (pr-str "Read fields: " fields-entry))

    (if fields-entry
      fields-entry
      [:id];if we cant find the fields then just return the ID field
      )))












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
  (println "inform-clients-about-record ")
  (let [the-record        (get-record-from-server-cache-for-id  db-table  id )
        clients-atom      (:clients the-record)
        ]
    (println (str "    the-record: " the-record))
    ;(println (str "    Record Clients: " @clients-atom))
    (if clients-atom

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
                   )))))
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










(defn folder [file-name]
  (cond

    (is-linux)
    (str *project-root-linux* file-name)

    (is-mac-osx)
    (str *project-root-mac* file-name)

    :else
    (str *project-root-windows* file-name)))



(defn src-folder [file-name]
  (cond

    (is-linux)
    (str *project-root-linux* "figwheel_dev_envs/app0/coils/src/webapp/framework/client/components/" file-name)

    (is-mac-osx)
    (str *project-root-mac* "figwheel_dev_envs/app0/coils/src/webapp/framework/client/components/" file-name)

    :else
    (str *project-root-windows* "figwheel_dev_envs\\app0\\coils\\src\\webapp\\framework\\client\\components\\" file-name)))





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
  (do
    (println (str "(defn parse-id [" s "]"))
    (let [find-num (re-find  #"\d+" s )]
      (if find-num
        (Integer. find-num)
        s))))

(defn get-id-type [ column-type ]
  (do
    (println (str "*******COLTYPE:" column-type ":"))
    (cond
    (= column-type "NUMBER")                       "INTEGER"
    (= column-type "integer")                      "INTEGER"
    (= column-type "character")                    "TEXT"
    (= column-type "character varying")            "TEXT"

    :else                                          "INTEGER"
    )
  ))



; ----------------------------------------------------------------
; Whenever a record changes an entry is added to the real time log
; which is processed here. It first finds which queries it
; belongs to and then changes them
; ----------------------------------------------------------------
(defn process-log-entry [ realtime-log-entry ]

  (let [
        id-type          (get-id-type (get realtime-log-entry (cond (= *database-type* "postgres" ) :record_id_type (= *database-type* "oracle") :record_id_type) ))
        id               (cond (= id-type "INTEGER")  (parse-id  (get realtime-log-entry (cond (= *database-type* "postgres" ) :record_id (= *database-type* "oracle") :record_id)))
                               (= id-type "TEXT")     (get realtime-log-entry (cond (= *database-type* "postgres" ) :record_id (= *database-type* "oracle") :record_id)))
        db-table         (get realtime-log-entry (cond (= *database-type* "postgres" ) :record_table_name (= *database-type* "oracle") :record_table_name))
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
    (if (= (get realtime-log-entry (cond (= *database-type* "postgres" ) :record_operation (= *database-type* "oracle") :record_operation)) "UPDATE")
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
    ;(println (str "      update-request: " update-request))
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






(defn delete-recursively [fname]
  (let [func (fn [func f]
               (when (.isDirectory f)
                 (doseq [f2 (.listFiles f)]
                   (func func f2)))
               (clojure.java.io/delete-file f))]
    (func func (clojure.java.io/file fname))))







(defn replace-in-file [ file-location     text-to-find   text-to-replace ]
  (do
    (println (str "***replace-in-file: "  file-location))
    (let [aa         (slurp  file-location)
          bb         (.replace  aa    (str text-to-find)  (str text-to-replace))]

      (spit file-location  bb))))

(println "********************************")
(def max-figwheel-processes 1)

(println (str "******************************** *hosted-mode* = " *hosted-mode*))





(def o2 (Object.))
(comment defn server-set-up-hosted-figwheel-clients []
  (future (locking o2
            (if (= @server-set-up-hosted-figwheel-clients? false)
              (do
                (reset! server-set-up-hosted-figwheel-clients? true)
                (println "server-set-up-hosted-figwheel-clients?_______________________________________-")



                ; deletes the realtime log every time the file is reloaded, or the server is restarted
                (comment if *hosted-mode*
                  (let [figwheel-index    (range 0 max-figwheel-processes)]
                    ;(println "********************************In hosted mode")

                    (if (does-table-exist "appshare_figwheel_processes")
                      (korma.core/exec-raw ["delete from appshare_figwheel_processes" []] []))





                    ( let [dir (str (cond (is-mac-osx) *project-root-mac*
                                          (is-linux)   *project-root-linux*
                                          :else *project-root-windows*) "figwheel_dev_envs")
                          java-dir (io/file dir)
                          app-dire-exists (.exists   java-dir)
                          ]
                      (println dir ":" app-dire-exists)
                      (if app-dire-exists
                        (delete-recursively   java-dir)
                        )


                      (println "")
                      (println "MKDIR:" java-dir)
                      (.mkdir   java-dir)
                      (println "DONE")
                      (println "")



                      ;(println (str "****** RANGE ************* " figwheel-index))
                      (doall (for [a figwheel-index]
                               (let [src-dir           (cond (is-mac-osx) (str  *project-root-mac* "coils/")
                                                             (is-linux) (str  *project-root-linux* "coils/")
                                                             :else (str *project-root-windows* "coils\\"))

                                     new-dir           (cond (is-mac-osx)  (str  *project-root-mac* "figwheel_dev_envs/app" a)
                                                             (is-linux)    (str  *project-root-linux* "figwheel_dev_envs/app" a)
                                                             :else         (str *project-root-windows* "figwheel_dev_envs\\app" a))
                                     java-new-dir      (io/file new-dir)
                                     figwheel-port     (+ a *base-dev-port*)
                                     ]
                                 (println (str "***making new figheel instance: " a " + " new-dir))
                                 (sql "insert into appshare_figwheel_processes (figwheel_port) values (?)" [figwheel-port])
                                 (.mkdir   java-new-dir)
                                 (fs/copy-dir src-dir  new-dir)

                                 (replace-in-file (str new-dir (cond (is-mac-osx)  "/coils/project.clj"
                                                                     (is-linux)    "/coils/project.clj"
                                                                     :else         "\\coils\\project.clj"))  3449 figwheel-port )

                                 (replace-in-file (str new-dir (cond (is-mac-osx)  "/coils/srcbase/webapp_config/settings.clj"
                                                                     (is-linux)    "/coils/srcbase/webapp_config/settings.clj"
                                                                     :else         "\\coils\\srcbase\\webapp_config\\settings.clj"))  3449 figwheel-port)

                                 (replace-in-file (str new-dir "/coils/start_figwheel_client.sh")  "*project-root*" (folder ""))
                                 (replace-in-file (str new-dir "/coils/start_figwheel_client.sh")  "*lein*" *lein*)

                                 ;(println (str "....pwd: "(me.raynes.conch.low-level/proc (str "pwd"))))
                                 (println (str "***STARTED CHMOD +X "))
                                 (if (is-mac-osx) (me.raynes.fs/chmod "+x" (str *project-root-mac* "figwheel_dev_envs/app0/coils/start_figwheel_client.sh")))
                                 (if (is-linux) (me.raynes.fs/chmod "+x" (str *project-root-linux* "figwheel_dev_envs/app0/coils/start_figwheel_client.sh")))
                                 (println (str "***DONE CHMOD +X "))

                                 (println (str "***STARTING APP   " a))
                                 (future (let [p  (cond (is-mac-osx) (me.raynes.conch.low-level/proc (str  *project-root-mac*      "figwheel_dev_envs/app0/coils/start_figwheel_client.sh"))
                                                        (is-linux) (me.raynes.conch.low-level/proc   (str  *project-root-linux*    "figwheel_dev_envs/app0/coils/start_figwheel_client.sh"))
                                                        :else        (me.raynes.conch.low-level/proc (str  *project-root-windows*  "figwheel_dev_envs\\app0\\coils\\start_figwheel_client.bat")))]
                                           (do
                                             (me.raynes.conch.low-level/stream-to-out p :out))))

                                 (println (str "***---STARTED APP   " a))
                                 ;(future (sh "call" "start_figwheel_client.bat"  :dir (str new-dir "\\coils")))

                                 )))))))))))







(def o (Object.))


(defn set-up-server-listeners []
  (future (locking o
  (if (= @server-set-up-client-listener? false)
    (do
      (reset! server-set-up-client-listener? true)
      (println "set-up-server-listeners_______________________________________-")


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


      (println "CHECK 200_______________________________________-")

      ; ----------------------------------------------------------------
      ; On the server check every 1 second for record changes on the
      ; database. If a record changes then send the log entry details to
      ; the channel 'server-side-record-changes'
      ; ----------------------------------------------------------------
      (every 200 (fn []
                   (do
                     ;(println (str "***"))
                     (let [next-id  @server-side-max-realtime-log-entry]
                       ;(println (str "*** server-side-max-realtime-log-entry *** : "  next-id))
                       (if next-id
                         (let [
                                get-realtime-log-entry            (cond
                                                                    (= *database-type* "postgres" )
                                                                        "select * from appshare_realtime_log WHERE id > ? order by id asc limit 1"

                                                                    (= *database-type* "oracle" )
                                                                        "select * from appshare_realtime_log WHERE ROWNUM <= 1 and id > ? order by id asc")

                                realtime-log-entry                (sql-1 get-realtime-log-entry [next-id])
                                ]
                           (do
                             ;(println (str "*** server-side-max-realtime-log-entry *** : "  realtime-log-entry))
                             ;(println "SERVER: How many real time records have changed? " how-many-records-have-changed? )
                             (if realtime-log-entry
                               (go
                                 (>! server-side-record-changes  realtime-log-entry)
                                 (reset!  server-side-max-realtime-log-entry  (:id  realtime-log-entry))
                                 ))

                             )))))) my-pool))))))




; ----------------------------------------------------------------
; Whenever a web client wants to know if the data it is showing
; needs to be updated it sends a request to this server side
; function
; ----------------------------------------------------------------
(defn !check-for-server-updates [{:keys [
                                     client-data-session-id
                                     ]}                         ]

  (let [client-data-atom    (if server-side-realtime-clients  (get @server-side-realtime-clients  client-data-session-id))
        response-atom       (if client-data-atom  client-data-atom )
        ]
      ;(server-set-up-hosted-figwheel-clients)
;    (if (not *hosted-mode*)
      (set-up-server-listeners)

    ;(println (str "      " ))
    ;(println "SERVER: check-for-server-updates for client: " client-data-session-id)
    ;(println (str "      " (keys @server-side-realtime-clients)))
    ;(println (str "      " (if client-data-atom  @client-data-atom)))
    ;(println (str "      response: " (if response-atom  @(get @response-atom :update-request )  )))
    (if response-atom
      @(get @response-atom :update-request )

      (do
        (create-client-cache  client-data-session-id)
        {:info "client disconnected"}))))








(defn !getfilecontents [{:keys [id]}]
  (if id
    (let [content-records (cond
                             (= *database-type* "postgres" )
                             (sql-1 "select  application_code as ac from appshare_applications where id = ?" [id])

                             (= *database-type* "oracle" )
                             (sql-1 "select  dbms_lob.substr( application_code, 3000, 1 ) as ac, dbms_lob.substr( application_code, 3000, 3001 ) as ac2 from appshare_applications where id = ?" [id]))
          content (str (get content-records :ac) (get content-records :ac2))
          ]
      (println (str "id: " id))
      {:value content})))











(defn !loadapp [{:keys [id] }]
  (do
    (let [content-records  (cond
                             (= *database-type* "postgres" )
                             (sql-1 "select  application_code as ac from appshare_applications where id = ?" [id])

                             (= *database-type* "oracle" )
                             (sql-1 "select  dbms_lob.substr( application_code, 3000, 1 ) as ac, dbms_lob.substr( application_code, 3000, 3001 ) as ac2 from appshare_applications where id = ?" [id]))


          ;content   (str (get content-records :ac) (get content-records :ac2))
          ;start     (slurp (src-folder "main_view_start.txt"))
          ;middle    content
          ;end       (slurp (src-folder "main_view_end.txt"))

          ;joined    (str  start  middle  end)
          ]
      ;(spit (src-folder "main_view.cljs") joined)
      ;(println (str "COMPILED:" start))
      nil
      )

    {:value ""}))









;(sql-1 "select  dbms_lob.substr( application_code, 10, 1 ) as ac, dbms_lob.substr( application_code, 10, 11 ) as ac2 from appshare_applications where id = ?" [3])









;(defn !savecode [{:keys [id] } code]
(defn !savecode [{:keys [id code] }]
  (do
    (sql "update appshare_applications set application_code = ? where id = ?" [code id])
    (let [;start     (slurp (src-folder "main_view_start.txt"))
          ;middle    code
          ;end       (slurp (src-folder "main_view_end.txt"))

          ;joined    (str  start  middle  end)
          ]
      ;(spit (src-folder "main_view.cljs") joined)
      ;(println (str "COMPILED:" start))
      nil
      )

    {:value code}))





;(defn !savecode [{:keys [id] } code]
(defn !savecode2 [{:keys [id code] }]
  (do
    (println (str "************* !savecode2" ))
    (sql "update appshare_applications set application_code = CONCAT(application_code, ?) where id = ?" [code id])
    (let [;start     (slurp (src-folder "main_view_start.txt"))
          ;middle    code
          ;end       (slurp (src-folder "main_view_end.txt"))

          ;joined    (str  start  middle  end)
          ]
      ;(spit (src-folder "main_view.cljs") joined)
      nil
      )

    {:value code}))







(defn get-publisher-for-user-id   [user-id]
  (if user-id
    (let [publisher-id
          (:fk_appshare_publisher_id
            (sql-1
              "select   fk_appshare_publisher_id   from   appshare_users_publishers   where fk_appshare_user_id = ? and default_publisher = 'T'" [user-id]))

          publisher
          (if publisher-id (sql-1 "select   id, publisher_name   from appshare_publishers where id = ?" [publisher-id]))]

      publisher)))





(defn get-user-for-session-id   [session-id]
  (if session-id
    (let [user-id  (:fk_appshare_user_id (sql-1 "select  fk_appshare_user_id  from  appshare_web_sessions  where  session_id = ?" [session-id]))
          user     (if user-id (sql-1 "select  id, user_name  from appshare_users where id = ?" [user-id]))]
      user)))










(defn !newapp [{:keys [session-id] }]

  (let [user        (get-user-for-session-id   session-id)

        publisher   (get-publisher-for-user-id   (:id user))

        response    (sql-1 "insert into appshare_applications (application_name,application_code, fk_appshare_publisher_id) values (?,?,?) returning id"
                           ["name"

                            (str
                              "(def counter (atom 0))\n\n"

                              "(defn-ui-component     sub-component   [app] {} \n"
                              "    (div nil \n"
                              "        (input {:type \"button\" \n"
                              "                :style {:margin \"20px\"}\n"
                              "                :value (str \"Click me: \" @counter \" times\")\n"
                              "                :onClick #(do\n"
                              "                              (swap! counter inc)\n"
                              "                              (refresh))})))\n\n"

                              "(defn-ui-component     main   [app] {}\n"
                              "    (div nil\n"
                              "        (component sub-component app []) \n"
                              "        (component sub-component app []) \n"
                              "         \"New app\"))")

                            (:id publisher)]
                           )]
    {:id (:id response)}))



; login_type           VARCHAR2(200 BYTE),
; login_user_name      VARCHAR2(200 BYTE),
; login_email          VARCHAR2(200 BYTE),
; login_password       VARCHAR2(200 BYTE),
; fk_appshare_user_id  NUMBER,





(defn does-login-with-email-exist? [email]
  (let [res  (:count (sql-1 (str "select count(*) from appshare_logins where UPPER(login_email) like '" (.toUpperCase email) "'")))]
      (pos? res)))




(defn !join-with-email [{:keys [email] }]
  (cond
    (does-login-with-email-exist? email)
    {:error                 "User already exists"
     :user-already-exists    true
     }

    :else
    (do
      {:success true}
      )))






(defn !login-with-email [{:keys [email] }]
  (cond
    (does-login-with-email-exist? email)
    {:success true
     }

    :else
    (do
      {
        :error                 "User does not exist"
        :user-doesnt-exist      true
        }
      )))





(defn !join-with-password [{:keys [password] }]
  (if (< (count password) 6)
    {:error "Password must be at least 6 characters"}
    {:success true}))



(defn !login-with-password [{:keys [password] }]
  (if (< (count password) 6)
    {:error "Password must be at least 6 characters"}
    {:success true}))






(defn !join-with-password-confirm [{:keys [password confirm-password] }]
  (if (not (= password confirm-password))
    {:error "Passwords do not match"}
    {:success true}))







(defn !join-go-pressed [{:keys [session-id email password] }]
  (cond
    (does-login-with-email-exist?  email)
    {:error "User already exists"}

    :else
    (let [
           publisher-id       (get (sql-1 "insert into appshare_publishers (publisher_name) values (?) returning id"     [(.toLowerCase email)]) :id)
           user-id            (get (sql-1 "insert into appshare_users (user_name) values (?) returning id"               [(.toLowerCase email)]) :id)
           user               (sql-1 "select id, user_name from appshare_users  where id=?" [user-id])
           ]

      (do
        (println (str "sessionid: " session-id))

        (sql-1 "insert into appshare_users_publishers (fk_appshare_user_id, fk_appshare_publisher_id,default_publisher) values (?,?, 'T') returning id"
               [user-id    publisher-id ])

        (sql "insert into appshare_logins (login_type, login_email, login_password, fk_appshare_user_id) values ('normal',?,?,?)"
             [(.toLowerCase email)     password    user-id])

        (sql "update  appshare_web_sessions  set fk_appshare_user_id = ? where session_id = ?"
             [user-id  session-id])

        {
          :success true
          :user    user
         }
        ))))







(defn !login-go-pressed [{:keys [session-id  email  password] }]
  (let [
         login-id           (sql-1 "select id, fk_appshare_user_id from appshare_logins where LOWER(login_email) = ? and  login_password = ?" [(.toLowerCase email)  password] )
         user-id            (get login-id :fk_appshare_user_id)
         user               (if user-id (sql-1 "select id, user_name from appshare_users  where id = ?" [user-id]))
         ]

    (println (str "user:" user))
    (cond
      user
      (do
        (sql "update  appshare_web_sessions  set fk_appshare_user_id = ? where session_id = ?" [user-id  session-id])
        {:success     true
         :user        user   }
        )

      :else
      {:error "User name or password incorrect"}
      )))






(defn !logout-session [{:keys [session-id]}]
    (sql "update  appshare_web_sessions  set fk_appshare_user_id = null where session_id = ?" [session-id] ))





(defn !saveappglyph [{:keys [id glyph]}]
  (sql "update  appshare_applications  set application_glyph = ? where id = ?" [glyph id ] ))











(defn !user-can-edit-app? [{:keys [id session-id]}]
  (if id
    (let [user    (get-user-for-session-id    session-id)

          app-publisher-id (:fk_appshare_publisher_id (sql-1 "select  fk_appshare_publisher_id   from    appshare_applications where id = ?" [id]))

          link             (if user (sql-1 "select  id from   appshare_users_publishers   where  fk_appshare_publisher_id = ? and  fk_appshare_user_id = ?" [app-publisher-id (:id user)]))

          no-publisher     (not app-publisher-id)

          ]
      (if (or link   no-publisher)
        {:value true}
        {:value false}
        ))))

