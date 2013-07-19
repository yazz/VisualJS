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


(defn
  coils-case-study-html [
                         ]
      (el :div {:style "padding: 40px;"
                  :text "Coils.cc was extracted from the nemcv.com project"})
  )



(defn
  nemcv-case-study-html [
                         ]
      (el :div {:style "padding: 40px;"
                  :text "This website was built itself with Clojure on Coils
                  just to show we eat our own dogfood!"})
  )

(define-action "show coils case study"
    (do
        (-> ($ :#case-study-example)
            (fade-out 200
                      #(do
                         (-> ($ :#case-study-example)
                             (empty)
                             (append (coils-case-study-html))
                             (fade-in)
                        )
                      )
             )
        )
        nil
     )
)

(define-action "show nemcv case study"
    (do
        (-> ($ :#case-study-example)
            (fade-out 200
                      #(do
                         (-> ($ :#case-study-example)
                             (empty)
                             (append (nemcv-case-study-html))
                             (fade-in)
                        )
                      )
             )
        )
        nil
     )
)

(defn homepage-html []

  (el
    :div {}
     [

        (el :h1 {:style "padding: 20px;"
                  :text "Case studies"} )

        (el :div {:style "margin:20px; display:inline;padding: 20px; border: 1px solid gray; width:100px; height: 100px;"
                  :text "NemCV.com"
                  :onmouseover #(do-action "show nemcv case study")
                  :onmouseout #(clear :#case-study-example )})

        (el :div {:style "margin:20px; display:inline;padding: 20px; border: 1px solid gray; width:100px; height: 100px;"
                  :text "coils.cc"
                  :onmouseover #(do-action "show coils case study")
                  :onmouseout #(clear :#case-study-example )})

        (el :div {:id "case-study-example" :style "padding: 40px;"
                  :text ""})

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

(do-action "show case studies view")