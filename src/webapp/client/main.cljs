(ns webapp.client.main
    (:require
        [webapp.client.views.loginpanel]
        [webapp.client.views.settings]
        [webapp.client.session]
        [webapp.framework.client.debugger-3d]
        [goog.net.cookies :as cookie]
    )
    (:use
        [webapp.framework.client.eventbus  :only [do-action esb]]
    )
)



(defn ^:export resizeScreenFn [w h]
    (.log js/console "RESIZE")
)


(defn ^:export main []
  (do-action "create blank page structure")
  (do-action "show top nav")
  (do-action "show home page")
)




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


;(.get goog.net.cookies "name" )
