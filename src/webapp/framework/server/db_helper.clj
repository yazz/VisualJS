(ns webapp.framework.server.db-helper

  [:require [clojure.string :as str]]
  [:use [korma.db]]
  [:use [korma.core]]
  [:use [webapp-config.settings]]
  [:use [webapp.framework.server.encrypt]]
  (:require [clojurewerkz.neocons.rest :as nr])
  (:require [clojurewerkz.neocons.rest.nodes :as nn])
  (:require [clojurewerkz.neocons.rest.relationships :as nrl])
  (:require [clojurewerkz.neocons.rest.cypher :as cy])
)


(defn db-count-records [table-name]
    (:count
     (first
     (exec-raw
                   [(str "SELECT count(*) FROM " table-name)
                    []]
                    :results)
    )))

(defn db-table-fields [table-name]
    (keys
     (first
     (exec-raw
                   [(str "SELECT * FROM " table-name " limit 1")
                    []]
                    :results)
    )))
