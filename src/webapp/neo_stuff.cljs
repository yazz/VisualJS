(ns webapp
 (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader                     :as reader]
        [crate.core                      :as crate]
        [cljs.core.async                 :as async :refer [chan close!]]
    )

  (:require-macros
    [cljs.core.async.macros :refer [go alt!]])

  (:use
        [webapp.framework.client.coreclient  :only [popup do-before-remove-element new-dom-id find-el clj-to-js sql-fn
                                                    header-text body-text
                                                    body-html make-sidebar swap-section  el clear remote
                                                    value-of add-to show-popover
                                                    ]]
        [webapp.framework.client.neo4j       :only [neo4j-fn neo-result]]
        [jayq.core                           :only [attr $ css append fade-out fade-in empty]]
        [webapp.framework.client.eventbus    :only [do-action esb undefine-action]]
        [webapp.client.session               :only [the-map]]
    )
    (:use-macros
        [webapp.framework.client.eventbus    :only [define-action redefine-action]]
        [webapp.framework.client.coreclient  :only [ns-coils defn-html on-click on-mouseover sql log neo4j]]
        [webapp.framework.client.neo4j       :only [neo4j neo4j-nodes]]
     )
)
(ns-coils 'webapp)


; return the raw data for a neo4j node
( go
    (.log js/console (str (<! (neo4j "START x = node(*) RETURN count(x) LIMIT 1" {} ))))
)




( go (log (str (<!
  (neo4j-nodes
   "create (u:User { email : { email2 }, title : 'Developer' }) return u"
   {:email2 "dfsfdsf@gmail.com"} "u")))))


( go (log (str (<!
  (neo4j-nodes
   "create (u:User { email : { email2 }, title : 'Developer' }) return u"
   {:email2 "dffds@gmail.com"} "u")))))







; return just the data for a neo4j node (still a lot!)
(comment go
 (.log js/console
       (str
        (neo-result
         (<! (neo4j "START x = node(17109) RETURN x" {} ))
         "x"))))




(comment
   go
   (.log js/console (str (neo-outgoing (<! (neo4j "START x = node(17109) RETURN x" {} )) "x")))
)

(comment go
   (.log js/console (str (neo-incoming (<! (neo4j "START x = node(0) RETURN x" {} )) "x")))
)

(comment go
     (<! (add-to-simple-point-layer {:name "bella centre" :x 0.12 :y 0.1} "ore2")))


(comment go
     (log (<! (find-names-within-distance   "ore2"  0   0  1000))) )


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




