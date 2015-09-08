(ns webapp.framework.server.globals
  (:require
   [clojure.core.async                      :refer [chan]]
))




(def cached-queries (atom {}))




(def cached-records (atom {}))



(def server-side-record-changes   (chan 1))




(def realtime-counter (atom 0))
