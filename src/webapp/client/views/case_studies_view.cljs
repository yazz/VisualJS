(ns webapp.client.case-studies-view
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

        (el :h1 {:style "padding: 20px;"
                  :text "Case studies"} )

        (el :div {:style "padding: 20px;"
                  :text "NemCV.com"})

        (el :div {:style "padding: 20px;"
                  :text "The coils.cc framework was taken from NemCV.com"})


        ;(el :div {:id "popup"})
     ]
  )
)






(define-action
    "show case studies view"
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
        nil
     )
)
