(ns webapp.framework.client.coreclient)


(defmacro on-click [el code]

    `(webapp.framework.client.coreclient/on-click-fn
             ~el
             (fn [] ~code)
    )
  )

(defmacro on-mouseover [el code]

    `(webapp.framework.client.coreclient/on-mouseover-fn
             ~el
             (fn [] ~code)
    )
  )

(comment macroexpand '(define-action
                   "clear main page2"
                   (clear "main")
))


