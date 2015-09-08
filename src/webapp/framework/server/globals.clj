(ns webapp.framework.server.globals
  (:require
   [clojure.core.async                      :refer [chan]]
))




(def cached-queries (atom {}))




(def cached-records (atom {}))



(def server-side-record-changes   (chan))




(def realtime-counter (atom 0))
