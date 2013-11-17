(ns webapp-config.settings)






(defonce ^:dynamic *mandrill-api-key* "enter_api_key_for_mandrill_here")

(defonce ^:dynamic *environment* "dev")

(defonce ^:dynamic *web-server* "127.0.0.1:3000")

(defonce ^:dynamic *database-server* "127.0.0.1")

(defonce ^:dynamic *database-user* "postgres")

(defonce ^:dynamic *database-password* "manager")

(defonce ^:dynamic *database-name* "webdb")

(defonce ^:dynamic *sql-encryption-password* "animal")

(defonce ^:dynamic *show-code* true)

<<<<<<< HEAD:srcdev/webapp_config/settings.clj
(defonce ^:dynamic *main-page* "coils.html")

=======
(defonce ^:dynamic *main-page* "main.html")
>>>>>>> 28f13873494cf33193ae99b2e8553ce47e7e058c:srcbase/webapp_config/settings.clj
