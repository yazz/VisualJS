(ns webapp.client.top-nav
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
    )
    (:use
        [webapp.framework.client.coreclient :only [sql el clear addto remote  add-to on-mouseover-fn]]
        [jayq.core                          :only [$ css  append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
        [webapp.framework.client.interpreter :only [!fn]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action]]
        [webapp.framework.client.coreclient :only [on-click on-mouseover]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)


(defn homepage-html []

  (el
    :div {}
     [

        (el :div {:style "padding: 20px;"
                  :text "Welcome to Clojure on Coils."} )

        (el :div {:style "padding: 20px;"
                  :text "Clojure on Coils is a Clojure based webapp framework for single page database backed webapps"})

        (el :div {:style "padding: 20px;"
                  :text "Uses: Clojure, Clojurescript, JQuery, Bootstrap.js"})


        (el :button
                      {:id    "help-button"
                       :style "margin: 20px;"
                       :class "btn btn-large"
                       :text "Help"
                       :onclick #(help)})

        (el :button
                      {:id    "dissappear-button"
                       :style "margin: 20px;"
                       :class "btn btn-large"
                       :text "Dissappear"
                       :onclick  #(! clear)
                       })

        (el :button
                      {:id "show-esb-button"
                       :style "margin: 20px;"
                       :class "btn btn-large"
                       :text "ESB"
                       :onclick #(esb)})

        ;(el :div {:id "popup"})
     ]
  )
)






(defn top-nav-bar []
        "<div class=navbar>
              <div class=navbar-inner>
                <a class=brand href='#'>Coils.cc</a>
                <ul class=nav>
                  <li id='home-button' class=active><a href='#'>Home</a></li>
                  <li id='docs-button'><a href='#'>Docs</a></li>
                  <li id='case-studies-button'><a href='#'>Case studies</a></li>
                  <li id='contact-button'><a href='#'>Contact</a></li>
                </ul>
              </div>
            </div>
   <div id=main-content-area ></div>
  "
  )


(defn remove-nav-active []
  (. ($ :#home-button) removeClass "active")
  (. ($ :#contact-button) removeClass "active")
  (. ($ :#case-studies-button) removeClass "active")
  (. ($ :#docs-button) removeClass "active")

)

(defn add-nav-listeners []

    (on-mouseover
              "home-button"

              (remove-nav-active)
              (. ($ :#home-button) addClass "active")
              (do-action "show home page"))


    (on-mouseover
              "docs-button"

              (remove-nav-active)
              (. ($ :#docs-button) addClass "active")
              (do-action "show docs page")
     )


    (on-mouseover
              "case-studies-button"

              (remove-nav-active)
              (. ($ :#case-studies-button) addClass "active")
              (do-action "show case studies view"))



    (on-mouseover
              "contact-button"

              (remove-nav-active)
              (. ($ :#contact-button) addClass "active")
              (do-action "show who page"))


)





(define-action
    "show top nav"
    (do
        (clear "top-section")
        (add-to "top-section" (top-nav-bar))
        (add-nav-listeners)

))