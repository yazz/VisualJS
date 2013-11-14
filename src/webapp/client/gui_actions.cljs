(ns webapp.client.gui-actions
    (:use
        [webapp.framework.client.coreclient    :only [clear remote add-to]]
        [webapp.framework.client.eventbus      :only [do-action esb undefine-action]])

    (:use-macros
        [webapp.framework.client.eventbus      :only [define-action]])
)





(define-action
    "clear homepage"
    (clear :#main))


