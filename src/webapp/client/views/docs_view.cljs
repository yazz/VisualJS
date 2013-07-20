(ns webapp.client.docs-view
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
        [webapp.framework.client.eventbus :only [define-action redefine-action]]
        [webapp.framework.client.coreclient :only [on-click on-mouseover]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)


(defn docspage-html []

  (el
    :div {}
     [

        (el :div {:style "padding: 20px;"
                  :text "Components"} )


        (el :button
                      {:id "show-esb-button"
                       :style "margin: 20px;"
                       :class "btn btn-large"
                       :text "ESB"
                       :onclick #(esb)})



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
                       :onclick #(esb)})     ]
  )
)








(redefine-action
    "show docs page"
    (swap-section
        ($ :#main-section)
        (docspage-html)
    )
)
;(do-action "show docs page")