(ns webapp.client.page-structure
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


(defn homepage-html []

  (el
    :div {}
     [

        (el :div {:style "padding: 0px;"
                  :id "top-section"} )

        (el :div {:style "padding: 0px;"
                  :id "main-section"} )
     ]
  )
)









(define-action
    "create blank page structure"
    (do
      (-> ($ :#main)
          (empty)
          (append (homepage-html))
          (fade-in)
          )
      )
  )
