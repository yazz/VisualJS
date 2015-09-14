(ns webapp.framework.server.globals
  (:require
   [clojure.core.async                      :refer [chan]]
))




(defonce cached-queries (atom {}))




(defonce cached-records (atom {}))



(defonce server-side-record-changes   (chan 1))




(defonce realtime-counter (atom 0))



(defonce realtime-clients (atom {}))
