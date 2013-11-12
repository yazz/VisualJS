(ns webapp.client.case-studies-view
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
    )
    (:use
        [webapp.framework.client.coreclient :only [sql-fn header-text body-text body-html make-sidebar  swap-section  el clear addto remote  add-to]]
        [jayq.core                          :only [$ css  append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
        [webapp.framework.client.interpreter :only [!fn]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action]]
        [webapp.framework.client.coreclient :only [makeit ns-coils defn-html on-click on-mouseover]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)
(ns-coils 'webapp.client.case-studies-view)




(defn-html coils-html []

  (el
    :div {}
     [

      (el :a {:href "http://github.com/zubairq/coils"}
            [
                  (el :div {:style "background: white; margin:20px;padding: 20px; border: 1px solid gray; width:100px; "
                            :text "coils.cc"
                  })

             ])

        (el :div {:style "padding: 40px;"
                  :text "Coils.cc was built with Clojure on Coils
                         just to show we eat our own dogfood!"})
     ]
  )
)


(defn-html nemcv-html []

  (el
    :div {}
     [

        (el :a {:href "http://nemcv.com"}
            [
                   (el :img {:style "background: blue; margin:20px;padding: 20px; border: 1px solid gray; width:100px; "
                       :text "NemCV.com"
                       :src "images/nemcv.png"})


                   (el :div {:style "padding: 40px;"
                       :text "NemCV.com is used officially as a CV
                              system in Europe. NemCV is based in the Copenhagen International House
                              and are part of the Work In Denmark programme"})
            ])
     ]
  )
)



(defn-html sidebar []
  (make-sidebar
       {:text "NemCV" :html (nemcv-html)}
       {:text "Clojure on Coils" :html (coils-html)}
   )
)



(define-action
    "show case studies view"
    (do
        (swap-section
            ($ :#main-section)
            (nemcv-html)
        )
        (swap-section
            ($ :#left-navigation)
            (sidebar)

        )
    )
)

(do-action "show case studies view")
