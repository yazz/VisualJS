(ns webapp.framework.client.coreclient
  [:use [webapp.framework.server.encrypt]]
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


( macroexpand '(sql "SELECT * FROM test_table where name = ?" ["shopping"] ))


(comment defmacro defn-html [name code]

    `(do
       (reset!
            webapp.framework.client.coreclient/gui-html
            (assoc (deref webapp.framework.client.coreclient/gui-html) ~name
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







(defmacro defn2 [name args & code]
  `(do
    (defn ~name
         ~args

         ~@code
     )
   )
)


(macroexpand '(defn2 dfffd [x] (+ 1 1)))

(defn2 hello2 [x] (+ 10 x))

(hello2 1)
