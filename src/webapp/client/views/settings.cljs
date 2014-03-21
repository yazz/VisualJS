(ns webapp.client.views.settings
    (:require
        [cljs.reader :as reader]
    )
    (:use
        [webapp.framework.client.coreclient :only  [body-html new-dom-id debug popup hide-popovers
                                                    show-popover set-text value-of find-el sql-fn neo4j-fn
                                                    swap-section el clear remote  add-to on-mouseover-fn on-click-fn]]
        [jayq.core                          :only  [$ css  append fade-out fade-in attr bind]]
  )
  (:use-macros
        [webapp.framework.client.eventbus :only    [redefine-action define-action]]
        [webapp.framework.client.coreclient :only  [ns-coils defn-html on-click on-mouseover]]
     )
)
(ns-coils 'webapp.client.views.settings)


(defn-html user-settings-html []
  (el :div {} [
               "<div>User settings</div>"
               ])
)

(redefine-action "show settings"
                 (swap-section "main-section"  (user-settings-html))
                 )
