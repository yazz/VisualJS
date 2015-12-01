(ns webapp.framework.server.globals
  (:require
   [clojure.core.async           :refer [chan]]
   [overtone.at-at               :refer [mk-pool]]
))






; -----------------------------------------------------------------------
; Used to record realtime changes as the result of database triggers
; -----------------------------------------------------------------------
(defonce server-side-record-changes     (chan 1))




; -----------------------------------------------------------------------
; The realtime records cached by the client
; -----------------------------------------------------------------------
(defonce server-side-cached-records     (atom {}))



; -----------------------------------------------------------------------
; This holds all the query results for the realtime queries
;
;
; -----------------------------------------------------------------------
(defonce server-side-cached-queries     (atom {}))







; -----------------------------------------------------------------------
; The caches for the web clients
; -----------------------------------------------------------------------
(defonce server-side-realtime-clients   (atom {}))






; -----------------------------------------------------
;
; -----------------------------------------------------
(def server-datasource-fields            (atom {})) ; list of the data sources and their fields



(defonce server-set-up-client-listener?   (atom false))
(defonce my-pool (mk-pool))







; -----------------------------------------------------------------------
; Max real time log entry read
; -----------------------------------------------------------------------
(defonce server-side-max-realtime-log-entry  (atom -1))




(defn is-linux []
  (do
    (println (str "......OS=" (java.lang.System/getProperty "os.name")))
    (if
      (= (java.lang.System/getProperty "os.name") "Linux")
      true
      )))


(defn is-mac-osx []
  (if
    (= (java.lang.System/getProperty "os.name") "Mac OS X")
    true
    ))

(java.lang.System/getProperty "os.version")

(java.lang.System/getProperty "os.arch")


