(ns webapp.framework.client.coreclient)


(defmacro onclick [el code]

    `(webapp.framework.client.coreclient/onclick-fn
             ~el
             (fn [] ~code)
    )
  )

(comment macroexpand '(define-action
                   "clear main page2"
                   (clear "main")
))


