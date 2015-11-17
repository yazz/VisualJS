(ns webapp.framework.client.webhosting.hostmain
  (:require
   [webapp.framework.client.coreclient   :as c ]
    [om.core :as om :include-macros true]
    )
  (:use-macros
   [webapp.framework.client.coreclient  :only [ns-coils defn-ui-component def-coils-app
                                               container  map-many  inline  text log sql textarea
                                               div img pre component h2 input section header button label form iframe
                                               write-ui read-ui container input component <-- data-view-result-set
                                               h1 h2 h3 h4 h5 h6 span  data-view-v2 select dselect realtime drealtime
                                               input-field
                                               ]])
  (:require-macros
   [cljs.core.async.macros :refer [go alt!]]))
(ns-coils 'webapp.framework.client.webhosting.hostmain)














(defn editor [code owner]
  (reify
    om/IDidMount
    (did-mount [_]
      (js/CodeMirror (om/get-node owner)
                     #js {:matchBrackets true :autoCloseBrackets true}))))















(defn-ui-component     main-hosting-component   [app] {}

  (div nil
       (div {} "App Share")
       (div {}
            (textarea {:style {:display "inline-block"}} "dd")

            ;(om/build editor app {:init-state {}})

            (iframe {:style {:display "inline-block"} :src "http://127.0.0.1:3450" :width "600" :height "800"})
            )
       ))





(def-coils-app     host-app   main-hosting-component)

