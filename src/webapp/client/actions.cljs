(ns webapp.client.messages
    (:use
        [webapp.framework.client.eventbus  :only [do-action esb undefine-action]]
        [webapp.framework.client.interpreter :only [!fn]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
    )

)

;(undefine-action    "clear main view")
;(do-action "clear homepage")

;(undefine-action    "show main view")
;(do-action "show homepage")
;(do-action "slideup")
;(do-action "show testpage")
;(do-action "show who page")
;(do-action "slidedown")

;(do-action {:name "test2"})


(comment  do-action {:name "test2"} )

(comment define-action
  {:key-to-watch :name :value-to-watch "test2"}
  (js/alert "test2 sent"))


(!!! str "ss" 12)

  (:type (first (!! str "ss" 122)))


  (! "df" 1)