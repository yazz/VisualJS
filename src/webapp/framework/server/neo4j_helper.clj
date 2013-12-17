(ns webapp.framework.server.neo4j-helper

  [:require [clojure.string :as str]]
<<<<<<< HEAD
  [:use [korma.db]]
  [:use [webapp.framework.server.systemfns]]
  [:use [webapp.framework.server.email-service]]
  [:use [webapp.framework.server.encrypt]]
  [:use [korma.core]]
  [:use [clojure.repl]]
  [:use [webapp.framework.server.db-helper]]

=======
>>>>>>> d7aefc69922ac88df13b2ee993a4ef7d5eb45877
  (:require [clojurewerkz.neocons.rest :as nr])
  (:require [clojurewerkz.neocons.rest.nodes :as nn])
  (:require [clojurewerkz.neocons.rest.relationships :as nrl])
  (:require [clojurewerkz.neocons.rest.cypher :as cy])
<<<<<<< HEAD
  (:use [webapp-config.settings])
  (:import [java.util.UUID])
=======
  (:require [clojurewerkz.neocons.rest.spatial :as nsp])
  (:require [clojurewerkz.neocons.rest.transaction :as tx])
  (:use [webapp-config.settings])
  (:import [java.util.UUID])

  (:require [cheshire.core             :as json]
            [clojurewerkz.neocons.rest :as rest]
            [clojurewerkz.support.http.statuses :refer :all]
            [clojurewerkz.neocons.rest.helpers  :refer :all]
            [clojurewerkz.neocons.rest.records  :refer :all])
  (:import  [java.net URI URL]
            clojurewerkz.neocons.rest.Neo4JEndpoint)

>>>>>>> d7aefc69922ac88df13b2ee993a4ef7d5eb45877
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







<<<<<<< HEAD
=======
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



>>>>>>> d7aefc69922ac88df13b2ee993a4ef7d5eb45877




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


(defn find-within-bounds
  "Find all points in the layer within a given bounds"
  [layer min-x max-x min-y max-y]
  (post-spatial "findGeometriesInBBox"
                {:layer layer :minx min-x :maxx max-x :miny min-y :maxy max-y}))



<<<<<<< HEAD
   ;(make4j {:type "place" :name "Moscow"})



   ;(table4j "place")
=======
(defn find-names-within-distance [layer x y dist-km]
  (map
    (fn [x]
      (let [data    (:data x)]
        {
          :id    (:id x)
          :name (:name data)
          :x    (:x data)
          :y    (:y data)
        }
      )
    )

    (find-within-distance layer x y dist-km)
  )
)



(defn find-names-within-bounds [layer minx maxx miny maxy]
  (map
    (fn [x]
      (let [data    (:data x)]
        {
          :id    (:id x)
          :name (:name data)
          :x    (:x data)
          :y    (:y data)
        }
      )
    )

    (find-within-bounds layer minx maxx miny maxy)
  )
)





;(find-names-within-bounds "ore2" 0.0 1.1 50.0 51.5)


;( find-names-within-distance "ore2" -10.1 -1.1 10000.1)




(comment  let [t (tx/begin-tx)]


  (tx/commit t))


(comment  try
     (add-simple-point-layer "ore2")
         (catch Exception e (str "caught exception: " (.getMessage e))))
>>>>>>> d7aefc69922ac88df13b2ee993a4ef7d5eb45877

   ;(nodes4j "place")
(comment let [amy (nn/create {:username "amy"})
        bob (nn/create {:username "bob"})
        _   (nrl/create amy bob :friend {:source "college"})]
    (println (nrl/incoming-for bob :types [:friend])))


