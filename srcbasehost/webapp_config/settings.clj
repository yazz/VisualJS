(ns webapp-config.settings)






(defonce ^:dynamic *mandrill-api-key* "enter_api_key_for_mandrill_here")

(defonce ^:dynamic *record-pointer-locally* false)
(defonce ^:dynamic *main-background-color* "rgb(37, 40, 48)")
(defonce ^:dynamic *main-text-color* "white")

(defonce ^:dynamic *record-ui* false)

(defonce ^:dynamic *email-debug-mode* true)

(defonce ^:dynamic *environment* "basehost")

(defonce ^:dynamic *web-server* "127.0.0.1:3449")
(defonce ^:dynamic *base-dev-port* 3450)


(defonce ^:dynamic *database-type* "postgres")
(defonce ^:dynamic *database-server* "127.0.0.1")
(defonce ^:dynamic *database-user* "postgres")
(defonce ^:dynamic *database-password* "manager")
(defonce ^:dynamic *database-name* "postgres")

(defonce ^:dynamic *hosted-mode* true)

(defonce ^:dynamic *project-root-windows* "D:\\project_coils\\")
(defonce ^:dynamic *project-root-mac* "../../project_coils/")
(defonce ^:dynamic *project-root-linux* "")


;(defonce ^:dynamic *database-type* "oracle")
;(defonce ^:dynamic *database-server* "localhost")
;(defonce ^:dynamic *database-user* "coils")
;(defonce ^:dynamic *database-password* "manager")
;(defonce ^:dynamic *database-name* "ORCL")



(defonce ^:dynamic *sql-encryption-password* "animal")

(defonce ^:dynamic *show-code* true)

(defonce ^:dynamic *main-page* "main.html")

;(defmacro setup-fn [] (quote webapp.framework.client.init/setup-properties))
;(defmacro setup-fn [] (quote webapp.client.demoapp/setup-properties3))
(defmacro setup-fn [] (quote webapp.framework.client.webhosting.hostinit/setup-properties2))

