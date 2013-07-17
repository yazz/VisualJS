(ns webapp.client.who-view
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
    )
    (:use
        [webapp.framework.client.coreclient :only [clear add-to help remote  add-to]]
        [jayq.core                          :only [$ css  append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action]]
        [webapp.framework.client.coreclient :only [onclick]]
     )
)





(defn whopage-html []
   [:div {}
    [:h1 {:style "padding: 20px;"}
                                    "Who makes Clojure on Coils?"]

           [:div {:style "padding: 20px;"}
                           "Clojure and Coils was extracted from the NemCV project by
                           Zubair Quraishi"]
    ]

)

(define-action
    "show who page"
    (do
        (-> ($ :#main-content-area)
            (fade-out 200
                      #(do
                         (-> ($ :#main-content-area)
                             (empty)
                             (append (crate/html (whopage-html)))
                             (fade-in)
                        )
                      )
             )
        )
        nil
     )
)



