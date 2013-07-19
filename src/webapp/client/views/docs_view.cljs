(ns webapp.client.docs-view
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
    )
    (:use
        [webapp.framework.client.coreclient :only [sql el clear addto remote  add-to]]
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


(defn docspage-html []

  (el
    :div {}
     [

        (el :div {:style "padding: 20px;"
                  :text "Documentation."} )


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







(define-action
    "show docs page"
    (do
        (-> ($ :#main-section)
            (fade-out 200
                      #(do
                         (-> ($ :#main-section)
                             (empty)
                             (append (docspage-html))
                             (fade-in)
                        )
                      )
             )
        )
        nil
     )
)
