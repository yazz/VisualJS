(ns webapp.client.main
    (:use
        [webapp.framework.client.eventbus  :only [do-action esb]]
    )
)

(do-action "show homepage")

