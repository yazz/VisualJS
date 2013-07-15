(ns webapp.framework.server.systemfns

  [:require [clojure.string :as str]]
  [:use [korma.db]]
  [:use [korma.core]]
)


(defdb db (postgres {:db "webdb"
                     :host "127.0.0.1"
                     :user "postgres"
                     :password "manager"}))




(defn !say-hello [params]
    {:text (str "System Hello " (:name params))}
)


(defn !sql [params]
    {:text "SQL RESULT"}
)