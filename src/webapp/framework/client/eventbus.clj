(ns webapp.framework.client.eventbus)


(defmacro define-action [message-arg code]

    `(webapp.framework.client.eventbus/receive-message-fn
             ~message-arg
             (fn [ ~(symbol "message") ] ~code )


    )
  )

(comment macroexpand '(define-action
                   "clear main page2"
                   (clear "main")
))


(comment macroexpand '(define-action
    "clear homepage"
    (clear :#main)))