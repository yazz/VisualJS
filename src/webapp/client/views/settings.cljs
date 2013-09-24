(ns webapp.client.views.settings
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
        [cljs.core.async :as async :refer         [chan close!]]
        [clojure.string]
    )
    (:use
        [webapp.framework.client.coreclient :only  [body-html new-dom-id debug popup hide-popovers
                                                    show-popover set-text value-of find-el sql-fn neo4j-fn
                                                    swap-section el clear remote  add-to on-mouseover-fn on-click-fn]]
        [jayq.core                          :only  [$ css  append fade-out fade-in empty attr bind]]
        [webapp.framework.client.help       :only  [help]]
        [webapp.framework.client.eventbus   :only  [do-action esb undefine-action]]
        [domina                             :only  [ by-id value destroy! ]]
  )
  (:require-macros
    [cljs.core.async.macros :refer                 [go alt!]])
  (:use-macros
        [webapp.framework.client.eventbus :only    [redefine-action define-action]]
        [webapp.framework.client.coreclient :only  [ns-coils makeit defn-html on-click on-mouseover sql defn-html
                                                    defn-html2 neo4j]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
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
