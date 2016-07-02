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



(defn get-schema-name    [full-name]
  (str (first (clojure.string/split  full-name  #"\."))))


(defn get-table-name    [full-name]
  (str (second (clojure.string/split  full-name  #"\."))))






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




(defn get-schema-name-for-session-id [data-session-id]
  (let [
         schema-id     (:fk_appshare_schema_id (sql-1 "select   fk_appshare_schema_id   from   public.appshare_web_sessions    where   session_id = ?" [data-session-id]))



         schema-name       (cond
                             schema-id
                             (:database_schema_name (sql-1 "select   database_schema_name   from   public.appshare_schemas  where  id = ?"  [schema-id]))

                             :else
                             "public")

         schema-name2      (if (= (count schema-name) 0) "public" schema-name)
         ]
    schema-name2))







;zzz
(defn !sql [{coded-sql  :sql
             params     :params
             session-id :session-id}]
  (do
    (let [sql             (decrypt coded-sql)
          lower           (.toLowerCase sql)
          schema          (get-schema-name-for-session-id   session-id)
          schema-sql      (str "set schema '" schema "';")
          ]
      (println "")
      (println "SQL from client: " coded-sql " -> " sql)
      (println "     session-id: " session-id)
      (println "         schema: " schema-sql)
      (println "")

      (let [results
            (cond
              (.startsWith lower "select")  (korma.db/transaction
                                              (korma.core/exec-raw [schema-sql []])
                                              (korma.core/exec-raw [sql params] :results)
                                              )

              :else                         (korma.db/transaction
                                              (korma.core/exec-raw [(str "set schema '" schema "';") []])
                                              (korma.core/exec-raw [sql params])
                                              []))]
        (do
          (korma.core/exec-raw [(str "set schema 'public';") []])
          results
          )))))





(defn !get-list-of-tables [{session-id :session-id}]
  (do
    (let [schema          (get-schema-name-for-session-id   session-id)
          table-names     (korma.core/exec-raw ["select * from information_schema.tables where table_schema = ?" [schema]] :results)
          ]
      (map :table_name table-names)
      )))














(defn !get-main-background-color []
  {:value *main-background-color*})




(defn !get-main-text-color []
  {:value *main-text-color*})








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
         user-id              (get web-session-in-db :fk_appshare_user_id)
         user                 (if user-id (sql-1 "select id, user_name from appshare_users  where id=?" [user-id]))
        ]
    (do
      (println (str "!create-session: " session-id-from-browser))
      {
        :session-id         session-id
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
    ;(println (str "db-table: " db-table))
    ;(println (str "where: " where))
    ;(println (str "params: " params))

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
          (str "CREATE TRIGGER trigger_afterInsert AFTER INSERT ON " table-name " FOR EACH ROW EXECUTE PROCEDURE public.trigger_function_afterInsert();")

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
          (str "CREATE TRIGGER trigger_afterUpdate AFTER UPDATE ON " table-name " FOR EACH ROW EXECUTE PROCEDURE public.trigger_function_afterUpdate();")

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
          (str "CREATE TRIGGER trigger_afterDelete AFTER DELETE ON " table-name " FOR EACH ROW EXECUTE PROCEDURE public.trigger_function_afterDelete();")

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
          CREATE TABLE public.appshare_triggers
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
          CREATE TABLE public.appshare_todo_items
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
          CREATE TABLE public.appshare_publishers
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
          CREATE TABLE public.appshare_web_sessions
          (
          id                               serial NOT NULL,
          fk_appshare_user_id              integer,
          fk_appshare_schema_id            integer,
          session_id                       character varying,
          CONSTRAINT appshare_web_sessions_pkey PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_web_sessions
          (
          id                               NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          fk_appshare_user_id              NUMBER,
          fk_appshare_schema_id            NUMBER,
          session_id                       VARCHAR2(200 BYTE),
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
          CREATE TABLE public.appshare_users_publishers
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
          fk_appshare_user_id       NUMBER,
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
          CREATE TABLE public.appshare_users
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
          CREATE TABLE public.appshare_logins
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
          CREATE TABLE public.appshare_applications
          (
          id                        serial NOT NULL,
          application_name          character varying,
          code_format               character varying,
          blockly_xml               character varying,
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
          code_format               VARCHAR2(40 BYTE),
          blockly_xml               CLOB,
          application_code          CLOB,
          fk_appshare_publisher_id  NUMBER,
          CONSTRAINT  APPSHARE_APPLICATIONS_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_applications"))
      (korma.core/exec-raw   [sql-to-create-applications-table []]   [])
      nil)))








(defn make-interfaces-table []
  (let [sql-to-create-interfaces-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE public.appshare_interfaces
          (
          id                                     serial NOT NULL,
          interface_name                         character varying,
          fk_default_interface_application_id    integer,
          CONSTRAINT appshare_interfaces_pkey PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_interfaces
          (
          id                                     NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          interface_name                         VARCHAR2(200 BYTE),
          fk_default_interface_application_id    NUMBER,
          CONSTRAINT  APPSHARE_INTERFACES_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_interfaces"))
      (korma.core/exec-raw   [sql-to-create-interfaces-table []]   [])
      nil)))







(defn make-application-implements-interface-table []
  (let [sql-to-create-application-implements-interface-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE public.appshare_application_implements_interface
          (
          id                                     serial NOT NULL,
          fk_application_id                      integer,
          interface_name                         character varying,
          CONSTRAINT appshare_application_implements_interface_pkey PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_application_implements_interface
          (
          id                                     NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          fk_application_id                      NUMBER,
          interface_name                         VARCHAR2(200 BYTE),
          CONSTRAINT  APPSHARE_APPLICATION_IMPLEMENTS_INTERFACE_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_application_implements_interface"))
      (korma.core/exec-raw   [sql-to-create-application-implements-interface-table []]   [])
      nil)))









(defn make-application-can-call-interface-table []
  (let [sql-to-create-application-can-call-interface-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE public.appshare_application_can_call_interface
          (
          id                                     serial NOT NULL,
          fk_application_id                      integer,
          interface_name                         character varying,
          CONSTRAINT appshare_application_can_call_interface_pkey PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_application_can_call_interface
          (
          id                                     NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          fk_application_id                      NUMBER,
          interface_name                         VARCHAR2(200 BYTE),
          CONSTRAINT  APPSHARE_APPLICATION_CAN_CALL_INTERFACE_PK PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_application_can_call_interface"))
      (korma.core/exec-raw   [sql-to-create-application-can-call-interface-table []]   [])
      nil)))




















(defn make-app-schemas-table []
  (let [sql-to-create-app-schemas-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE public.appshare_application_schemas
          (
          id                                               serial NOT NULL,
          fk_appshare_application_id                       integer,
          fk_appshare_schema_id                            integer,
          application_environment                          character varying,
          CONSTRAINT appshare_application_schemas_pkey    PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_application_schemas
          (
          id                                             NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          fk_appshare_application_id                     NUMBER,
          fk_appshare_schema_id                          NUMBER,
          application_environment                        VARCHAR2(200 BYTE),
          CONSTRAINT  APPSHARE_APPLICATION_SCHEMAS_PK    PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_application_schemas"))
      (korma.core/exec-raw   [sql-to-create-app-schemas-table []]   [])
      nil)))












(defn make-schemas-table []
  (let [sql-to-create-schemas-table
        (cond
          (= *database-type* "postgres" )
          "
          CREATE TABLE public.appshare_schemas
          (
          id                                               serial NOT NULL,
          fk_appshare_publisher_id                         integer,
          database_schema_name                             character varying,
          CONSTRAINT appshare_schemas_pkey    PRIMARY KEY (id)
          );
          "

          (= *database-type* "oracle" )
          "
          CREATE TABLE appshare_schemas
          (
          id                                             NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
          fk_appshare_publisher_id                       NUMBER,
          database_schema_name                           VARCHAR2(200 BYTE),
          CONSTRAINT  APPSHARE_SCHEMAS_PK    PRIMARY KEY (ID)
          )")
        ]

    (if (not (does-table-exist  "appshare_schemas"))
      (korma.core/exec-raw   [sql-to-create-schemas-table []]   [])
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
        INSERT INTO public.appshare_realtime_log
        (record_timestamp,  record_table_schema, record_table_name,  record_id, record_id_type, record_operation)
        VALUES
        ( now(),   TG_TABLE_SCHEMA , TG_TABLE_NAME ,  NEW.id,
        (select data_type from information_schema.columns where column_name='id' and table_name = TG_TABLE_NAME and table_schema = TG_TABLE_SCHEMA),
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
        INSERT INTO public.appshare_realtime_log
        (record_timestamp,  record_table_schema, record_table_name,  record_id, record_id_type,  record_operation)
        VALUES
        ( now(),   TG_TABLE_SCHEMA ,TG_TABLE_NAME ,  NEW.id,
        (select data_type from information_schema.columns where column_name='id' and table_name = TG_TABLE_NAME and table_schema = TG_TABLE_SCHEMA),
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
        INSERT INTO public.appshare_realtime_log
        (record_timestamp,  record_table_schema, record_table_name,  record_id, record_id_type,  record_operation)
        VALUES
        ( now(),   TG_TABLE_SCHEMA, TG_TABLE_NAME ,  OLD.id,
        (select data_type from information_schema.columns where column_name='id' and table_name = TG_TABLE_NAME and table_schema = TG_TABLE_SCHEMA),
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
(make-interfaces-table)
(make-application-implements-interface-table)
(make-application-can-call-interface-table)
(make-app-schemas-table)
(make-schemas-table)
(make-triggers-table)
(make-log-table)

(cond
  (= *database-type* "postgres" )
  (do
    (make-log-table-insert-trigger-function)
    (make-log-table-update-trigger-function)
    (make-log-table-delete-trigger-function)))





(defn do-real [& {:keys [:table-name]}]
  ;(println "-real**: table name: " table-name)

  (create-realtime-trigger  :table-name  table-name));(get-table-name  table-name)))





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
      ;(println "SQL::: " sql "," id , ":fields:" fields)
      (sql-1  sql [id])
      )))










(defn delete-record-from-realtime-update  [ table-name    record-id     data-session-id ]
  (do
    ;(println (str "delete-record-from-realtime-update: " ))
    ;(println (str "              table-name: "       table-name))
    ;(println (str "              record-id: "        record-id))
    ;(println (str "              data-session-id: "  data-session-id))

  (let [client-data-atom         (if server-side-realtime-clients  (get @server-side-realtime-clients  data-session-id))
        response-atom            (if client-data-atom  client-data-atom )
        update-request-atom      (if response-atom  (get @response-atom :update-request ))
        update-request           (if update-request-atom  @update-request-atom)
        ]
    ;(println (str "      update-request: " update-request))
    (if update-request-atom
      (swap! update-request-atom  dissoc-in  [:records table-name record-id])
      ))))

















(defn get-record [db-table  id  fields  realtime  client-id]
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
                    (if clients-atom
                      (swap!  clients-atom  conj  client-id))
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










(defn inform-clients-about-record  [schema  db-table   id]
  (println (str "inform-clients-about-record: " schema " . " db-table))
  (let [full-table-name    (str schema "." db-table)
         the-record        (get-record-from-server-cache-for-id  full-table-name  id )
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
      ;(println (str "     existing-query: "  existing-query))

      (if (not existing-query)
        (swap! server-side-cached-queries assoc  query (atom {:clients  (atom #{})})))



      ;(println (str "    server: " @(get @server-side-cached-queries   query)))

      (let [the-query        (get @server-side-cached-queries   query)
            clients-atom     (:clients @the-query)


            ]
        (swap! the-query assoc  :records       result-id-vector)
        (swap! the-query assoc  :count         record-count)
        (swap! the-query assoc  :timestamp     query-time)

        (println (str "    clients: " @clients-atom))
        (doall (for [client @clients-atom]
                 (do
                   ;(println (str "    Client: " client))
                   (let [the-client       (get @server-side-realtime-clients  client)
                         response-atom    (:update-request @the-client)
                         ]
                     (if (not response-atom) (swap! the-query assoc  :update-request (atom {})))
                     (let [client-query    (assoc query :db-table (get-table-name  (:db-table query)))]
                       (println (str "    query: " client-query))
                       (swap! (:update-request @the-client) assoc-in [:queries client-query] {:timestamp query-time})
                       ;(println (str "    responses: " (if response-atom @response-atom)))
                       )
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
    ;(println (str "(defn parse-id [" s "]"))
    (let [find-num (re-find  #"\d+" s )]
      (if find-num
        (Integer. find-num)
        s))))

(defn get-id-type [ column-type ]
  (do
    ;(println (str "*******COLTYPE:" column-type ":"))
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
        ;db-table         (str (:record_table_schema realtime-log-entry) "." (:record_table_name realtime-log-entry))
        db-table         (str (:record_table_name realtime-log-entry))
        db-schema        (str (:record_table_schema realtime-log-entry))
        full-table-name  (str db-schema "." db-table)
        ]
    ;(println (str "**** Processing realtime record change: "))
    ;(println (str "      schema.db-table: "  db-schema "." db-table))
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
    ;(println (str "********************************  "))
    ;(println (str "*       db-table: "   db-table ))
    ;(println (str "********************************  "))
    ;(println (str ""))
        (update-record-in-cache  full-table-name   id)
        (inform-clients-about-record  db-schema   db-table   id)))



    ; ----------------------------------------------------------------
    ; First we make sure that any queries which access the same
    ; table as the record that changed are checked
    ; ----------------------------------------------------------------
    (let [queries (keys @server-side-cached-queries)]
      (doall (for [query queries]
               (do
                 (if (= (get-table-name (get query :db-table))   db-table)
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


(defn clear-client-cache [client-realtime-id]
  (let [client-cache     (get @server-side-realtime-clients  client-realtime-id)
        ]
    (if client-cache
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

  (let [
         schema-name        (get-schema-name-for-session-id   data-session-id)
         full-table-name    (str schema-name "." db-table)
         ]

    ;(if (not (= "public" schema-name ))
    (do
      ;(println "************************************************************************************")
      ;(println (str "* SCHEMA:          "  schema-name))
      ;(println (str "* full-table-name: "  full-table-name))
      ;(println "************************************************************************************")
      ;(println "")
      )
    ;)


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
                      :db-table  full-table-name
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

     (do-real   :table-name (str schema-name "." db-table))

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
           record-count      (get-count   (str schema-name "." db-table)  where   params)



           results

           (get-results   :db-table (str schema-name "." db-table)
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
       )))))








(defn !get-record-result
  [{:keys [
            db-table
            id
            fields
            data-session-id
            realtime
            ]}]
  (let [
         schema-name        (get-schema-name-for-session-id   data-session-id)
         full-table-name    (str schema-name "." db-table)
         ]
    ;(println (str " !get-record-result DATA_SESSION_ID: " data-session-id))
    ;(println (str " !get-record-result realtime: " realtime))
    {:value
     (get-record   full-table-name  id  fields  realtime  data-session-id)}))






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






(defn !getfilecontents [{:keys [calling-from-application-id    running-application-id    app-session-id]}]
  (if running-application-id
    (let [content-records      (cond
                                 (= *database-type* "postgres" )
                                 (sql-1 "select
                                            application_code as ac,
                                            blockly_xml,
                                            code_format
                                        from appshare_applications where id = ?" [running-application-id])

                                 (= *database-type* "oracle" )
                                 (sql-1 "select
                                            dbms_lob.substr( application_code, 3000, 1 ) as ac,
                                            dbms_lob.substr( application_code, 3000, 3001 ) as ac2,
                                            dbms_lob.substr( blockly_xml, 3000, 1 ),
                                            code_format
                                        from
                                            appshare_applications where id = ?"
                                        [running-application-id]))

          content              (str (get content-records :ac) (get content-records :ac2))

          blockly              (str (get content-records :blockly_xml) )

          code-format          (str (get content-records :code_format) )

          app-id-schema-to-use (if  calling-from-application-id  calling-from-application-id  running-application-id)

          schema-id            (:fk_appshare_schema_id (sql-1 "select  fk_appshare_schema_id  from
                                                              appshare_application_schemas  where
                                                              application_environment = 'DEV' and fk_appshare_application_id = ?"
                                                              [app-id-schema-to-use]))

          int-sql              (sql "select interface_name from
                                    appshare_application_can_call_interface where  fk_application_id = ?" [app-id-schema-to-use])

          interfaces-list      (map  :interface_name  int-sql)

          get-default-app-fn   (fn [interface-name]
                                 {interface-name
                                  (:fk_default_interface_application_id
                                    (sql-1 "select   fk_default_interface_application_id   from
                                           appshare_interfaces   where   interface_name  =   ?" [interface-name]))})

          enriched-interfaces  (reduce merge (map get-default-app-fn  interfaces-list))

          can-use-interfaces   enriched-interfaces
          ]

      (do
        (clear-client-cache   app-session-id)

        (println (str ""))
        (println (str "************************************************************************************"))
        (println (str "!getfilecontents        calling-from-application-id: "        calling-from-application-id))
        (println (str "!getfilecontents        running-application-id:      "        running-application-id))
        (println (str "!getfilecontents        app-id-schema-to-use:        "        app-id-schema-to-use))
        (println (str "!getfilecontents  schema-id: "   schema-id))
        (println (str "" ))

        (cond
          schema-id
          (sql "update  appshare_web_sessions  set fk_appshare_schema_id = ?  where  session_id = ?"  [schema-id   app-session-id])

          :else
          (do
            (sql "update  appshare_web_sessions  set fk_appshare_schema_id = NULL  where  session_id = ?"  [app-session-id])))

        {:value                 content
         :can-use-interfaces    can-use-interfaces
         :blockly               blockly
         :code-format           code-format}))

    {:value "" :error "No content"}
    ))











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








(defn !savecode [{:keys [id   code   app-session-id] }]
  (do
    (println (str "***********id: " id))
    (sql "update  appshare_applications  set  code_format='text', application_code = ?,
         blockly_xml = NULL where  id = ?" [code id])



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










(defn !saveblockly [{:keys [id   code   app-session-id] }]
  (do
    (println (str "***********id: " id))
    (sql "update  appshare_applications  set  code_format='blockly',
         blockly_xml = ? where  id = ?" [code id])
    {:value code}))


(defn !saveblockly2 [{:keys [id code] }]
  (do
    (println (str "************* !savecode2" ))
    (sql "update appshare_applications set application_code = CONCAT(blockly_xml, ?) where id = ?" [code id])
    {:value code}))









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






(defn make-schema-for-app-id [new-app-id]
  (let [new-schema-name    (str "app_" new-app-id "_dev")
        new-schema         (sql-1 "insert into appshare_schemas (database_schema_name) values (?) returning id" [new-schema-name])
        new-schema-id      (:id new-schema)
        ]
    (do
      (sql-1 "insert into appshare_application_schemas  (fk_appshare_application_id,fk_appshare_schema_id, application_environment) values (?, ?,?)"
             [new-app-id  new-schema-id  "DEV"])

      (sql-1 "insert into appshare_application_can_call_interface  (fk_application_id, interface_name) values (?, ?)"
             [new-app-id  "edit.my.database"])


      (sql-1 (str "create schema " new-schema-name)
             [])

      {:id new-app-id})))




(defn !newapp [{:keys [session-id] }]

  (let [user        (get-user-for-session-id   session-id)

        publisher   (get-publisher-for-user-id   (:id user))

        response    (sql-1 "insert into appshare_applications (application_name,blockly_xml, code_format, fk_appshare_publisher_id) values (?,?,'blockly',?) returning id"
                           ["name"

                            (str
                              "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"appshare_element_text\" id=\"d?V/0)?e6WKZ+NR2PXE|\" x=\"190\" y=\"50\"><field name=\"VALUE\">Drags the blocks on the left</field></block><block type=\"appshare_element_br\" id=\"U6WZDp1Q,t{cst)udJXM\" x=\"210\" y=\"96\"></block><block type=\"appshare_element_text\" id=\"KZ*thb:kjZx#BEgF|Dq%\" x=\"190\" y=\"150\"><field name=\"VALUE\">...</field></block><block type=\"appshare_element_br\" id=\"`:n[GgLg5RHREGdii]Oc\" x=\"210\" y=\"190\"></block><block type=\"appshare_element_text\" id=\"K~Ozon5%-t4sdwy:27cy\" x=\"190\" y=\"250\"><field name=\"VALUE\">And see the result on the right</field></block></xml>")


                            (:id publisher)]
                           )

        new-app-id      (:id response)
        ]
    (do

      (make-schema-for-app-id   new-app-id)
      {:id new-app-id})))



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
         }))))







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











(try
  (if (= (get (sql-1 "select count(*) from public.appshare_applications"  []) :count) 0)
    (do
      (sql "insert into appshare_applications (application_name,  application_code) values (?,?)" ["todo", (slurp "resources\\public\\init\\todo.cljs")])

      (let [id (get (sql-1 "insert into appshare_applications (application_name,  application_code) values (?,?) returning id"
                           ["DBExplorer", (slurp "resources\\public\\init\\dbexplorer.cljs")]) :id)]

        (do
          (sql "insert into appshare_interfaces (interface_name,  fk_default_interface_application_id) values (?,?)"       ["edit.my.database"  id])

          (sql "insert into appshare_application_implements_interface (fk_application_id, interface_name) values (?,?)"    [id   "edit.my.database"])

          (make-schema-for-app-id   id)


          ))))
  (catch Exception e
    (str "Error creating public.appshare_applications: " (.getMessage e))))
