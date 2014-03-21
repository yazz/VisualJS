(ns webapp.framework.client.neo4j
  [:use [webapp.framework.server.encrypt]]
  (:use clojure.pprint)
  (:require [rewrite-clj.parser :as p])
  (:require [rewrite-clj.printer :as prn]))



(defmacro neo4j [cypher-str params]
  `(webapp.framework.client.neo4j.neo4j-fn
    ~(encrypt cypher-str)
    ~params
    ))






(defmacro neo4j-nodes [cypher-str params return]
  `(webapp.framework.client.neo4j.neo4j-nodes-fn
    ~(encrypt cypher-str)
    ~params
    ~return
    ))


