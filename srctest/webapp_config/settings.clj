(ns webapp-config.settings)






(defonce ^:dynamic *mandrill-api-key* "replace this with your madrill API key")

(defonce ^:dynamic *environment* "Test")

(defonce ^:dynamic *web-server* "127.0.0.1")

(defonce ^:dynamic *database-server* "127.0.0.1")

(defonce ^:dynamic *database-user* "postgres")

(defonce ^:dynamic *database-password* "manager")

(defonce ^:dynamic *database-name* "webdb")

(defonce ^:dynamic *sql-encryption-password* "animal")

(defonce ^:dynamic *show-code* false)

