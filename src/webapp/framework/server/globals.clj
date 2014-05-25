(ns webapp.framework.server.globals

)





(def init-fns (atom []))
(defn add-init-fn [x]
  (swap! init-fns conj x)
  )


