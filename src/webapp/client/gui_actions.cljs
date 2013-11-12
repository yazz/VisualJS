(ns webapp.client.gui-actions
    (:require
        [cljs.reader :as reader]
    )
    (:use
        [webapp.framework.client.coreclient :only [clear addto help remote  add-to]]
    ;    [jayq.core                          :only [$ css  append]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action]]
        [webapp.framework.client.coreclient :only [onclick]]
     )
)





(define-action
    "clear homepage"
    (clear :#main))


