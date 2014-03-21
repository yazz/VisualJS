(ns webapp.framework.client.eventbus
   (:use clojure.pprint)
   (:require [rewrite-clj.parser :as p])
   (:require [rewrite-clj.printer :as prn])

  )







(defmacro define-action [message-arg code]

    `(do
       (reset!
            webapp.framework.client.eventbus/esb-actions
            (assoc (deref webapp.framework.client.eventbus/esb-actions) ~message-arg
              ~(with-out-str (write `(quote
                                     ~code)
                                      :dispatch clojure.pprint/code-dispatch))
            )
        )

       (webapp.framework.client.eventbus/receive-message-fn
             ~message-arg
             (fn [ ~(symbol "message") ] ~code ))

    ))







(comment  macroexpand '(define-action
                   "clear main page2"
                   (do (clear "main") (clear "main"))
))

(comment println   (with-out-str (write (quote
                  (do (println "Hello") (println "Goodbye") (println "Hey, you left me out!"))
                                            :dispatch clojure.pprint/code-dispatch))))

(comment println (with-out-str (write
 (quote (do (println (str "Hello")) (println "Goodbye") (println "Goodbye dsasd sda d dda")))
 :dispatch clojure.pprint/code-dispatch)))

(comment println(with-out-str (clojure.pprint/write
      (quote (do (println "Hello") (println "Goodbye") (println "Hey, you left me out!")))
      :dispatch clojure.pprint/code-dispatch)))

;(println (prn/->string (p/parse-string "(defn my-function [a]  (* a 3))")))

;(p/parse-string "(defn my-function [a]\n  (* a 3))")


;(println 2)







(defmacro redefine-action [message-arg code]

    `(do
       (reset!
            webapp.framework.client.eventbus/esb-actions
            (assoc (deref webapp.framework.client.eventbus/esb-actions) ~message-arg
              ~(with-out-str (write `(quote
                                     ~code)
                                      :dispatch clojure.pprint/code-dispatch))
            )
        )

       (webapp.framework.client.eventbus/undefine-action
            ~message-arg
         )

       (webapp.framework.client.eventbus/receive-message-fn
             ~message-arg
             (fn [ ~(symbol "message") ] ~code ))

    ))








(comment macroexpand '(define-action
    "clear homepage"
    (clear :#main)))






