(ns webapp.framework.server.globals
  (:require
   [clojure.core.async                      :refer [chan]]
))



; -----------------------------------------------------------------------
; The ID of the last server side realtime log item
; -----------------------------------------------------------------------
(defonce server-side-realtime-counter   (atom 0))

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
