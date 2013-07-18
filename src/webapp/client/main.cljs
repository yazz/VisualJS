(ns webapp.client.main
    (:use
        [webapp.framework.client.eventbus  :only [do-action esb]]
    )
)

(do-action "create blank page structure")
(do-action "show top nav")
(do-action "show homepage")



(comment remote "say-hello"
        {:name "Johnny"}
        (fn [reply] (js/alert (str (:text reply))))
)



(comment  remote "!say-hello"
        {:name "Johnny"}
        (fn [reply] (js/alert (str (:text reply))))
)


(comment remote "get-db-data" {:a 1}
                           (fn [reply]
                               (js/alert reply)))


;(sql "" {} (fn[reply] (js/alert (str reply))))


;(do-action "refresh homepage")

