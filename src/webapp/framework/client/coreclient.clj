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