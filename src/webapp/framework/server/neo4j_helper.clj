(ns webapp.framework.server.neo4j-helper

  [:require [clojure.string :as str]]
  [:use [korma.db]]
  [:use [webapp.framework.server.systemfns]]
  [:use [webapp.framework.server.email-service]]
  [:use [webapp.framework.server.encrypt]]
  [:use [korma.core]]
  [:use [clojure.core.async]]
  [:use [clojure.repl]]
  [:use [webapp.framework.server.db-helper]]

  (:require [clojurewerkz.neocons.rest :as nr])
  (:require [clojurewerkz.neocons.rest.nodes :as nn])
  (:require [clojurewerkz.neocons.rest.relationships :as nrl])
  (:require [clojurewerkz.neocons.rest.cypher :as cy])
  (:require [clojurewerkz.neocons.rest.spatial :as nsp])
  (:use [webapp-config.settings])
  (:import [java.util.UUID])
  (:require [cheshire.core             :as json]
            [clojurewerkz.neocons.rest :as rest]
            [clojurewerkz.support.http.statuses :refer :all]
            [clojurewerkz.neocons.rest.helpers  :refer :all]
            [clojurewerkz.neocons.rest.records  :refer :all])
  (:import  [java.net URI URL]
            clojurewerkz.neocons.rest.Neo4JEndpoint)

)


(try
     (nr/connect! "http://localhost:7474/db/data/")
         (catch Exception e (str "caught exception: " (.getMessage e))))



(defn get-from-neo [params]
    {:value (into []
         (let [amy (nn/create {:username "amy" :age 27})
                bob (nn/create {:username "bob" :age 28})
                _   (nrl/create amy bob :friend {:source "college"})
                res (cy/tquery "START x = node({ids}) RETURN x.username, x.age" {:ids (map :id [amy bob])})]
            res)
          )})


;(get-from-neo nil)











(defonce neo4j-type-index
     ( try
     (nn/create-index "types")
         (catch Exception e (str "caught exception: " (.getMessage e))))
 )



   (defn to-nodes4j [results]
        (into []
           (map
             #(get %1 "resultset")
             results)))


   (defn to-maps4j [results]
        (into []
           (map
             #(:data (get %1 "resultset"))
             results)))


   (defn table4j [table-name]
     (to-maps4j
         (cy/tquery "START resultset=node:types('type:*') where resultset.type={type} RETURN resultset"
                    {:type table-name})))



   (defn nodes4j [table-name]
     (to-nodes4j
         (cy/tquery "START resultset=node:types('type:*') where resultset.type={type} RETURN resultset"
                    {:type table-name})))




   (defn make4j [node]
      (if (:type node)
         (let [
                 node     (nn/create node)
              ]
              (nn/add-to-index (:id node)  (:name neo4j-type-index) "type" (:type node))
         )
         (throw (new java.lang.Exception "needs a type"))
      )
   )



   ;(make4j {:type "place" :name "Moscow"})



   ;(table4j "place")

   ;(nodes4j "place")
(comment let [amy (nn/create {:username "amy"})
        bob (nn/create {:username "bob"})
        _   (nrl/create amy bob :friend {:source "college"})]
    (println (nrl/incoming-for bob :types [:friend])))


(def layer (nsp/add-simple-point-layer "food4"))

;layer


;(nsp/add-simple-point-layer layer 0.1 0.1)

(def mcd (nn/create {:name "mcDonalds"
                     ;:wkt "POINT(51.6306,-0.80029)"
                     :lat "lat" :lon "lon"}))



(comment nsp/add-simple-point-layer
     layer
    "lat" "lon")

;(nsp/find-within-distance layer 51.6306 -0.80029 5)


(defn- spatial-location-for
  [^Neo4JEndpoint endpoint action]
  (str (:uri endpoint) "ext/SpatialPlugin/graphdb/" action))

(defn- post-spatial
  [item-type body]
  (let [{:keys [status headers body]} (rest/POST
                                       (spatial-location-for rest/*endpoint* item-type)
                                       :body (json/encode body))
        payload  (json/decode body true)]
    (map instantiate-node-from payload)))

;;
;; API
;;

(defn add-simple-point-layer
  "Add a new point layer to the spatial index"
  ([layer lat lon]
     (first (post-spatial "addSimplePointLayer" {:layer layer :lat lat :lon lon})))
  ([layer]
     (first (post-spatial "addSimplePointLayer" {:layer layer}))))


(add-simple-point-layer "d" "lat" "lon")

(defn add-node-to-layer
  "Add a node with the appropriate latitude and longitude properties to the given layer"
  [layer node]
  (first (post-spatial "addNodeToLayer" {:layer layer :node (node-location-for rest/*endpoint* (:id node))})))

(def gg (nn/create {:name "ds" :lat "-1.1" :lon "-1.1"}))

gg

(get gg :location-uri)

layer

(add-node-to-layer (get gg :location-uri) layer )



(defn find-within-distance
  "Find all points in the layer within a given distance of the given point"
  [layer point-x point-y distance-in-km]
  (post-spatial "findGeometriesWithinDistance"
                {:layer "food4" :pointX point-x :pointY point-y :distanceInKm distance-in-km}))




(find-within-distance layer "-1.1" "-1.1" "10000.1")

(def layer (nsp/add-simple-point-layer "food4"))








(defn add-editable-layer
  "Add a new point layer to the spatial index"
  ([layer]
     (first (post-spatial "addEditableLayer" {:layer layer}))))

(add-editable-layer "zoo")



(defn get-layer
  "Add a new point layer to the spatial index"
  ([layer]
     (first (post-spatial "getLayer" {:layer layer}))))

(get-layer "zoo")
(defn add-node-to-layer
  "Add a new point layer to the spatial index"
  ([node layer]
     (first (post-spatial "addNodeToLayer" {:node node :layer layer}))))

(add-node-to-layer "http://localhost:7474/db/data/node/2" "zoo")





