(ns webapp.framework.server.neo4j-helper

  [:require [clojure.string :as str]]
  [:use [korma.db]]
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










(defonce neo4j-type-index
     ( try
     (nn/create-index "types")
         (catch Exception e (str "caught exception: " (.getMessage e))))
 )







(defn to-maps4j [results]
  (into []
        (map
         #(:data (get %1 "resultset"))
         results)))




(defn table4j [table-name]
  (to-maps4j
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





(defn add-simple-point-layer [lname]
  (nsp/add-simple-point-layer
   lname "y" "x"))


;(add-simple-point-layer "ore2")





;(nsp/find-within-distance "pl" 51.6306 -0.80029 50000)




(defn add-node-to-layer
  "Add a node with the appropriate latitude and longitude properties to the given layer"
  [node layer]
  (first (post-spatial "addNodeToLayer" {:layer layer
                                         :node  (node-location-for rest/*endpoint* (:id node))
                                         })))


(defn add-to-simple-layer [nname x y layer]
  (let [
        node          (nn/create {:name nname :x x :y y})
        result        (add-node-to-layer node layer)
        ]
            (:id result)

  )
)

(defn get-layer
  "Add a new point layer to the spatial index"
  ([layer]
     (first (post-spatial "getLayer" {:layer layer}))))

;(get-layer "ore2")


;(add-to-simple-layer "McDonalds" -10.1 -1.0 "ore2")



(defn find-within-distance
  "Find all points in the layer within a given distance of the given point"
  [layer point-x point-y distance-in-km]
  (post-spatial "findGeometriesWithinDistance"
                {:layer layer :pointX point-x :pointY point-y :distanceInKm distance-in-km}))


(defn find-names-within-distance [layer x y dist-km]
  (map
    (fn [x]
      (let [data    (:data x)]
        {
          :name (:name data)
          :x    (:x data)
          :y    (:y data)
        }
      )
    )
    (find-within-distance layer x y dist-km)
  )
)

;(find-names-within-distance "ore2" -10.1 -1.1 10000.1)





