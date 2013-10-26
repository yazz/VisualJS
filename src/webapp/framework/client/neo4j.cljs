(ns webapp.framework.client.neo4j
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
        [cljs.core.async :as async :refer         [chan close!]]
        [clojure.string]
    )
    (:use
        [webapp.framework.client.coreclient :only  [body-html new-dom-id debug popup hide-popovers
                                                    show-popover set-text value-of find-el sql-fn neo4j-fn
                                                    swap-section el clear remote  add-to on-mouseover-fn on-click-fn]]
        [jayq.core                          :only  [$ css  append fade-out fade-in empty attr bind]]
        [webapp.framework.client.help       :only  [help]]
        [webapp.framework.client.eventbus   :only  [do-action esb undefine-action]]
        [domina                             :only  [ by-id value destroy! ]]
  )
  (:require-macros
    [cljs.core.async.macros :refer                 [go alt!]])
  (:use-macros
        [webapp.framework.client.eventbus :only    [redefine-action define-action]]
        [webapp.framework.client.coreclient :only  [ns-coils makeit defn-html on-click on-mouseover sql defn-html
                                                    defn-html2 neo4j log log-async]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)
(ns-coils 'webapp.framework.client.neo4j)


(defn neo-data [x] (first x))
(defn neo-keys [x] (-> x (neo-data) (keys)))
(defn neo-result [x k] (-> x (neo-data) (get k)))
(defn neo-result-keys [x k] (-> x (neo-data) (get k) (keys)))
(defn neo-properties [x k] (-> x (neo-data) (get k) (get :data)))
(defn neo-incoming [x k] (-> x (neo-data) (get k) :incoming_relationships))
(defn neo-outgoing [x k] (-> x (neo-data) (get k) :outgoing_relationships))


(defn neo-id [x]
    (js/parseInt (.substring x (+ (.indexOf x "data/node/") 10)))
)


(comment go
   (.log js/console (str (neo-outgoing (<! (neo4j "START x = node(0) RETURN x" {} )) "x")))
)

(comment go
   (.log js/console (str (neo-incoming (<! (neo4j "START x = node(0) RETURN x" {} )) "x")))
)

(comment go
   (.log js/console (str (neo-result (<! (neo4j "START x = node(0) RETURN x" {} )) "x")))
)








(defn create-neo4j-record [properties]
  (go
      (log
          (let [
                 rr (<! (neo4j "CREATE (n {values}) return n, ID(n)" {:values properties}  ) )
                ]
               (str
                   (merge
                      (neo-properties
                         rr
                         "n")
                       {
                            :id (js/parseInt (get (first rr) "ID(n)"))
                        }
                   )

                )
            )
        )
    )
)


(defn count-all-neo4j-records []
  (go
     (get (first (<!
             (neo4j "START x = node(*) RETURN count(x)" {} )
     )) "count(x)")
  )
)


(defn count-all-neo4j-records-with-field [ field-name ]
  (go
     (get (first
        (<!
             (remote "!count-all-neo4j-records-with-field" {:field-name (name field-name)})
        )
     ) "count(x)")
  )
)

(defn get-all-neo4j-records-with-field [ field-name ]
  (go
     (map (fn[x] (merge
                     {:id  (get x "ID(x)")}
                     (:data  (get x "x"))
                 )
          )

        (<!
             (remote "!get-all-neo4j-records-with-field" {:field-name (name field-name)})
        )
     )
  )
)

(defn delete-all-neo-4j-nodes [ & {:keys [  are-you-sure?  ]}]
    (go
        (<! (neo4j "START n = node(*) MATCH n-[r?]-() WHERE ID(n)>0 DELETE n, r;"{}))
     )
)


(comment go
    (log (<! (get-all-neo4j-records-with-field :type)))
)

(comment go
    (log (<! (count-all-neo4j-records-with-field :type)))
)

;(delete-all-neo-4j-nodes :are-you-sure? "yes")

(comment go
    (log (<! (count-all-neo4j-records)))
)



(comment log "hey" 2)



(comment create-neo4j-record {
                      :name "defn-html"
                      :type "code"
                      })


(defn add-to-simple-point-layer  [ item layer-name ]
    (go
        (<! (remote "!add-to-simple-point-layer"   {:node item :layer-name layer-name}))
    )
)


(comment go
     (<! (add-to-simple-point-layer {:name "bella centre" :x 0.12 :y 0.1} "ore2")))




(defn find-names-within-distance [  layer-name x y km ]
    (go
        (<! (remote "!find-names-within-distance"   {:layer-name layer-name :x x :y y :dist-km km}))
    )
)


(comment go
     (log (<! (find-names-within-distance   "ore2"  0   0  1000))) )
