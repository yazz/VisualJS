(ns webapp.client.who-view
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
    )
    (:use
        [webapp.framework.client.coreclient :only [new-dom-id debug popup hide-popovers
                                                   show-popover set-text value-of find-el sql-fn
                                                   swap-section sql el clear remote  add-to on-mouseover-fn on-click-fn]]
        [jayq.core                          :only [$ css  append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action]]
        [webapp.framework.client.coreclient :only [makeit ns-coils defn-html onclick]]
     )
)
(ns-coils 'webapp.client.who-view)




(defn-html whopage-html []
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
        (swap-section
           :#main-section
           (whopage-html))

       (swap-section
            ($ :#left-navigation)
            "<div></div>")

        nil
     )
)



