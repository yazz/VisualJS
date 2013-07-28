(ns webapp.client.main-view
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
    )
    (:use
        [webapp.framework.client.coreclient :only [swap-section sql el clear addto remote  add-to]]
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


        ;(el :div {:id "popup"})
     ]
  )
)







(define-action
    "show homepage"
    (do

        (add-to "main-section" (homepage-html))

))

(define-action
    "refresh homepage"
    (do
      (do-action "clear homepage")
      (do-action "show homepage")
    )
)

(define-action
    "show home page"
    (do
        (-> ($ :#main-section)
            (fade-out 200
                      #(do
                         (-> ($ :#main-section)
                             (empty)
                             (append (homepage-html))
                             (fade-in)
                        )
                      )
             )
        )

      (swap-section
            ($ :#left-navigation)
            "<div></div>")
        nil
     )
)

