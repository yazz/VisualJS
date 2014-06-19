(ns webapp.framework.server.globals

)





(def init-fns (atom []))
(defn add-init-fn [nm x]
  (do
    (println (str "add-init-fn: " nm ))
    (swap! init-fns conj x)
    ))


