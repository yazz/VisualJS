(ns webapp-config.settings)






(defonce ^:dynamic *mandrill-api-key* "enter_api_key_for_mandrill_here")

(defonce ^:dynamic *record-pointer-locally* false)
(defonce ^:dynamic *main-background-color* "white")
(defonce ^:dynamic *main-text-color* "black")

(defonce ^:dynamic *record-ui* false)

(defonce ^:dynamic *email-debug-mode* true)

(defonce ^:dynamic *environment* "base")

(defonce ^:dynamic *appshare-dev-server* "127.0.0.1")
(defonce ^:dynamic *appshare-cljs-source* "http://127.0.0.1:3449/outide/")
(defonce ^:dynamic *web-server* "127.0.0.1:3449")
(defonce ^:dynamic *base-dev-port* 3449)
(defonce ^:dynamic *use-figwheel* false)


(defonce ^:dynamic *database-type* "postgres")
(defonce ^:dynamic *database-server* "127.0.0.1")
(defonce ^:dynamic *database-user* "postgres")
(defonce ^:dynamic *database-password* "manager")
(defonce ^:dynamic *database-name* "postgres")

(defonce ^:dynamic *hosted-mode* false)

(defonce ^:dynamic *project-root-windows* "D:\\project_coils\\")
(defonce ^:dynamic *project-root-mac* "/project_coils/")
(defonce ^:dynamic *project-root-linux* "/root/appshare/project_coils/")

(defonce ^:dynamic *lein* "~/lein.sh")

(defonce ^:dynamic *cookie-name* "subapp_")


;(defonce ^:dynamic *database-type* "oracle")
;(defonce ^:dynamic *database-server* "localhost")
;(defonce ^:dynamic *database-user* "coils")
;(defonce ^:dynamic *database-password* "manager")
;(defonce ^:dynamic *database-name* "ORCL")



(defonce ^:dynamic *sql-encryption-password* "animal")

(defonce ^:dynamic *show-code* true)

(defonce ^:dynamic *main-page* "devclient.html")

