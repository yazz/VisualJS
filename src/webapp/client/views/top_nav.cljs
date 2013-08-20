(ns webapp.client.top-nav
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
        [cljs.core.async :as async :refer [chan close!]]
    )
    (:use
        [webapp.framework.client.coreclient :only [sql el clear addto remote  add-to on-mouseover-fn on-click-fn]]
        [jayq.core                          :only [$ css  append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
        [domina                             :only [ by-id value destroy! ]]
  )
  (:require-macros
    [cljs.core.async.macros :refer [go alt!]])
  (:use-macros
        [webapp.framework.client.eventbus :only [redefine-action define-action]]
        [webapp.framework.client.coreclient :only [on-click on-mouseover]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)





(defn top-nav-bar []
        "<a class=navbar-brand href='#'>Coils.cc</a>
                <ul class='nav navbar-nav'>
                  <li id='home-button' class=active><a href='#'>Home</a></li>
                  <li id='docs-button'><a href='#'>Docs</a></li>
                  <li id='case-studies-button'><a href='#'>Case studies</a></li>
                  <li id='contact-button'><a href='#'>Contact</a></li>
                </ul>")







(defn remove-nav-active []
  (. ($ :#home-button) removeClass "active")
  (. ($ :#contact-button) removeClass "active")
  (. ($ :#case-studies-button) removeClass "active")
  (. ($ :#docs-button) removeClass "active"))






(defn add-nav-listeners []

    (on-click
              "home-button"

              (remove-nav-active)
              (. ($ :#home-button) addClass "active")
              (do-action "show home page")
     )


    (on-click
              "docs-button"

              (remove-nav-active)
              (. ($ :#docs-button) addClass "active")
              (do-action "show docs page")
     )


    (on-click
              "case-studies-button"

              (remove-nav-active)
              (. ($ :#case-studies-button) addClass "active")
              (do-action "show case studies view")
     )



    (on-click
              "contact-button"

              (remove-nav-active)
              (. ($ :#contact-button) addClass "active")
              (do-action "show who page")
     )
)







(redefine-action
    "show top nav"
    (do
        (clear "top-left")
        (add-to "top-left" (top-nav-bar))
        (add-nav-listeners)

        (do-action "show login signup panel")
))

;(do-action "show top nav")
