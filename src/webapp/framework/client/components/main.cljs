(ns webapp.framework.client.components.main
  (:require
   [webapp.framework.client.coreclient   :as c :include-macros true]))

(c/ns-coils 'webapp.framework.client.components.main)


(c/defn-ui-component     cc2   [app]
                         {}

                         (c/div nil
                                "Build database webapps with Clojure"))



(c/defn-ui-component     main-view   [app]
  {}

  (c/div nil
       (c/h2 nil "Coils")
         (c/component cc2  app  [])
       ""))
