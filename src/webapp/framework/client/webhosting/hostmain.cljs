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
  (do  (go (if  (read-ui app [:app-id])
             (let [x (remote  !getfilecontents  {:id (read-ui app [:app-id]) })]
               (js/createEditor)
               (js/populateEditor (get x :value))))))}


  (div {}
            (div {:style {:display "inline-block" :width "1200" :height "800" :verticalAlign "top"}}
                 (textarea {:id "cm" :style {:display "inline-block" :width "1200" :height "800"}} ""))

            (iframe {:style {:display "inline-block"} :src "http://127.0.0.1:3450" :width "600" :height "800"})))
















(defn-ui-component     browser-component   [app]  {}


  (div {:style {:margin "30px"}}
       (realtime select id, application_name from coils_applications order by id {}
               (div nil


                    (button {:style {:marginRight "30px" :marginBottom "10px"}
                             :className "btn btn-small"
                             :onClick     #(go (sql "delete from coils_applications
                                              where id = ?"
                                              [(<-- :id) ]  )
                                             )
                             } "X")




                    (cond
                      (and (= (read-ui app [:submode]) "editappname") (= (<-- :id ) (read-ui app [:app-id])))
                      (input-field {:style {:marginBottom "20px" :color "black"} :placeholder  "Enter name"}
                                   app
                                   (fn [new-name]
                                     (let [id (read-ui app [:app-id])]
                                       (go
                                         (sql "update  coils_applications
                                              set application_name = ?
                                              where id = ?"
                                              [new-name id ]  )
                                         ;(js/alert (str new-name ":" id))
                                         (write-ui app [:submode] nil)
                                         ))))


                      :else
                      (div {:onClick     #(go  (write-ui app [:submode] "editappname")
                                               (write-ui app [:app-id] (<-- :id))

                                               )

                            :style {:display "inline-block" :fontFamily "Ubuntu" :fontWeight "700" :fontSize "1.3em" ::marginTop "0.7em"}}
                           (str (<-- :application_name))))






                    (button {:style {:marginBottom "10px" :marginLeft "30px"} :className "btn btn-default"
                             :onClick     #(go (write-ui app [:mode] "edit")
                                             (write-ui app [:app-id] (<-- :id))
                                             (remote !loadapp {:id (<-- :id)})
                                             )
                             } "Edit")

                    ))))


















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
                     :onClick     #(go
                                      (remote !newapp {}))   } "New")



            (a {:className    "btn btn-default"
                :target       "new"
                :style       {:float "right"  :display "inline-block" :marginLeft "30px" :fontFamily "Ubuntu" :fontSize "1em"  :marginTop "0.2em" }
                :href         "http://127.0.0.1:3450"} "Run in own window")

            (button {:className    "btn btn-default"
                     :style       {:float "right" :display "inline-block" :marginLeft "30px" :fontFamily "Ubuntu" :fontSize "1em" :marginTop "0.2em"  }
                     :onClick     #(go
                                     (let [code (.getValue js/myCodeMirror) ]
                                       (remote !savecode {:id (read-ui app [:app-id])} code))   )} "Save")

            )
       (cond
         (or (= (read-ui app [:mode]) nil) (= (read-ui app [:mode]) "browse"))
         (component browser-component app [])

         (= (read-ui app [:mode]) "edit")
         (component editor-component app [])

         :else
         (div {} "Nothing selected"))))







(def-coils-app     host-app   main-hosting-component)

