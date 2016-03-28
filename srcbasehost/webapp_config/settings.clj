(ns webapp-config.settings)






(defonce ^:dynamic *mandrill-api-key* "enter_api_key_for_mandrill_here")

(defonce ^:dynamic *main-background-color* "rgb(37, 40, 48)")
(defonce ^:dynamic *main-text-color* "white")

(defonce ^:dynamic *email-debug-mode* true)

(defonce ^:dynamic *environment* "basehost")

(defonce ^:dynamic *web-server* "127.0.0.1:3449")
(defonce ^:dynamic *use-figwheel* true)


(defonce ^:dynamic *database-type* "postgres")
(defonce ^:dynamic *database-server* "127.0.0.1")
(defonce ^:dynamic *database-user* "postgres")
(defonce ^:dynamic *database-password* "manager")
(defonce ^:dynamic *database-name* "postgres")

(defonce ^:dynamic *hosted-mode* true)

(defonce ^:dynamic *project-root-windows* "D:\\project_coils\\")
(defonce ^:dynamic *project-root-mac* "../../project_coils/")
(defonce ^:dynamic *project-root-linux* "../../project_coils/")

(defonce ^:dynamic *lein* "~/lein.sh")

(defonce ^:dynamic *cookie-name* "appshare.co")


;(defonce ^:dynamic *database-type* "oracle")
;(defonce ^:dynamic *database-server* "localhost")
;(defonce ^:dynamic *database-user* "coils")
;(defonce ^:dynamic *database-password* "manager")
;(defonce ^:dynamic *database-name* "ORCL")



(defonce ^:dynamic *sql-encryption-password* "animal")

(defonce ^:dynamic *show-code* true)

(defonce ^:dynamic *main-page* "main.html")

