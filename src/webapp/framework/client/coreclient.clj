(ns webapp.framework.client.coreclient
  [:use [webapp.framework.server.encrypt]]
     (:use clojure.pprint)
   (:require [rewrite-clj.parser :as p])
   (:require [rewrite-clj.printer :as prn])

)


(defmacro on-click [el & code]

    `(webapp.framework.client.coreclient/on-click-fn
             ~el
             (fn [] (do ~@ code))
    )
  )

(defmacro on-mouseover [el & code]

    `(webapp.framework.client.coreclient/on-mouseover-fn
             ~el
             (fn [] (do ~@code))
    )
  )


(comment macroexpand '(define-action
                   "clear main page2"
                   (clear "main")
))

(defmacro sql [sql-str params]
  `(webapp.framework.client.coreclient.sql-fn
       ~(encrypt sql-str)
       ~params
   )
)

(defmacro neo4j [cypher-str params]
  `(webapp.framework.client.coreclient.neo4j-fn
       ~(encrypt cypher-str)
       ~params
   )
)


;( macroexpand '(sql "SELECT * FROM test_table where name = ?" ["shopping"] ))




(defn- xml-str
 "Like clojure.core/str but escapes < > and &."
 [x]
  (-> x str (.replace "&" "&amp;") (.replace "<" "&lt;") (.replace ">" "&gt;")))



(defn ns-coils-debug [] "ZZZ")

(defmacro defn-html [fname args & code]
  `(do
        (defn ~fname
             ~args

             (webapp.framework.client.coreclient/debug ~@code ~(str `~fname))
        )

        (webapp.framework.client.coreclient/makeit2
             (~'ns-coils-debug)
             ~(str `~fname) ~args

          (str ~(with-out-str   (write (first `~code))
                                        :dispatch clojure.pprint/code-dispatch))
        )



   )
)

(macroexpand '(defn-html erw (do (str "frf"))))


(defmacro ns-coils [namespace-name]
  `(defn ~'ns-coils-debug  [] (str ~namespace-name))
)


;(macroexpand '(ns-coils dfd))

