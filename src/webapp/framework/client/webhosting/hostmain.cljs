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




(defn-ui-component     editor-component   [app]
 {:on-mount
   (do  (go (let [x (remote  !getfilecontents  {:file-name nil})]
              (js/createEditor)
              (js/populateEditor (get x :value)))))}


  (div {}
            (div {:style {:display "inline-block" :width "1200" :height "800" :verticalAlign "top"}}
                 (textarea {:id "cm" :style {:display "inline-block" :width "1200" :height "800"}} ""))

            (iframe {:style {:display "inline-block"} :src "http://127.0.0.1:3450" :width "600" :height "800"})))







(defn-ui-component     main-hosting-component   [app]
  {:on-mount
   (do  (go (let [x (remote  !getfilecontents  {:file-name nil})]
              (js/createEditor)
              (js/populateEditor (get x :value)))))}


  (div nil
       (div {:style     {:border "0px" :backgroundColor "black" :width "100%" :height "3em" :verticalAlign "top"}}
            (div {:style {:display "inline-block" :fontFamily "Ubuntu" :fontWeight "700" :fontSize "1.3em" ::marginTop "0.7em"}} "AppShare")

            (button {:className    "btn btn-default"
                     :style       {:display "inline-block" :marginLeft "30px" :fontFamily "Ubuntu" :fontSize "1em" :marginTop "-0.9em"}
                     :onClick     #(write-ui app [:mode] "browse")} "Browse")

            (button {:className    "btn btn-default"
                     :style       {:display "inline-block" :marginLeft "30px" :fontFamily "Ubuntu" :fontSize "1em" :marginTop "-0.9em"}
                     :onClick     #(write-ui app [:mode] "edit")} "Edit")



            (a {:className    "btn btn-default"
                :target       "new"
                :style       {:float "right"  :display "inline-block" :marginLeft "30px" :fontFamily "Ubuntu" :fontSize "1em"  :marginTop "0.2em" }
                :href         "http://127.0.0.1:3450"} "Run in own window")

            (button {:className    "btn btn-default"
                     :style       {:float "right" :display "inline-block" :marginLeft "30px" :fontFamily "Ubuntu" :fontSize "1em" :marginTop "0.2em"  }
                     :onClick     #(go
                                     (let [code (.getValue js/myCodeMirror) ]
                                       (remote !savecode {} code))   )} "Save")

            )
       (cond
         (or (= (read-ui app [:mode]) nil) (= (read-ui app [:mode]) "browse"))
         (div {} "Browse")

         (= (read-ui app [:mode]) "edit")
         (component editor-component app [])

         :else
         (div {} "Nothing selected"))))





(def-coils-app     host-app   main-hosting-component)

