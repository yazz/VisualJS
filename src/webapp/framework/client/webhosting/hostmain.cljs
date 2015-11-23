(ns webapp.framework.client.webhosting.hostmain
  (:require
   [webapp.framework.client.coreclient   :as c ]
    [om.core :as om :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]]
    )
  (:use-macros
   [webapp.framework.client.coreclient  :only [ns-coils defn-ui-component def-coils-app
                                               container  map-many  inline  text log sql textarea a
                                               div img pre component h2 input section header button label form iframe
                                               write-ui read-ui container input component <-- data-view-result-set
                                               h1 h2 h3 h4 h5 h6 span  data-view-v2 select dselect realtime drealtime
                                               input-field remote
                                               ]])
  (:require-macros
   [cljs.core.async.macros :refer [go alt!]]))
(ns-coils 'webapp.framework.client.webhosting.hostmain)







(defn-ui-component     main-hosting-component   [app]
  {:on-mount
   (do
     (go
       (log (str "*******************"))
       (let [x (remote  !getfilecontents  {:file-name nil})]
         (log (str "*******************" x))
         (js/createEditor)
         (js/populateEditor (get x :value))
         ))
     )}

  (div nil
       (div {:style     {:border "15px"}}
            (div {:style {:display "inline-block" :fontFamily "Ubuntu" :fontWeight "700" :fontSize "1em"

                          }} "AppShare")
            (button {:className "btn btn-default"
                     :style     {:display "inline-block" :marginLeft "30px"}
                     :onClick   #(go
                                   (let [code (.getValue js/myCodeMirror) ]
                                     (remote !savecode {} code))
                                   )} "Save")
            (a {:className "btn btn-default"
                :target "new"
                     :style     {:display "inline-block" :marginLeft "30px"}
                     :href   "http://127.0.0.1:3450"} "Run in own window"))
       (div {}
            (div {:style {:display "inline-block" :width "1200" :height "800" :verticalAlign "top"}}
                 (textarea {:id "cm" :style {:display "inline-block" :width "1200" :height "800"}} ""))

            (iframe {:style {:display "inline-block"} :src "http://127.0.0.1:3450" :width "600" :height "800"})
            )
       ))





(def-coils-app     host-app   main-hosting-component)

