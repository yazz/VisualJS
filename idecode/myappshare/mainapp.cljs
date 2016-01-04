(ns myappshare.mainapp
  (:require
   [webapp.framework.client.coreclient   :as c ]
   [om.core :as om :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]])

  (:use-macros
   [webapp.framework.client.coreclient  :only [ns-coils defn-ui-component def-coils-app
                                               container  map-many  inline  text log sql textarea a
                                               div img pre component h2 input section header button label form iframe
                                               write-ui read-ui container input component <-- data-view-result-set
                                               h1 h2 h3 h4 h5 h6 span  data-view-v2 select dselect realtime drealtime
                                               input-field remote
                                               ]])
  (:use
   [webapp.framework.client.system-globals :only  [appshare-dev-server appshare-dev-port]])

  (:require-macros
   [cljs.core.async.macros :refer [go alt!]]))
(ns-coils 'myappshare.mainapp)








(def ns-counter (atom 0))

(defn start [] (str "(ns webapp.framework.client.fns" @ns-counter "\n
  (:require-macros
    [webapp.framework.client.macros :refer [ refresh  ns-coils   div button input span defn-ui-component component]]))
(ns-coils 'webapp.framework.client.fns " @ns-counter ")"))
(defn end [] "(webapp.framework.client.system-globals.touch [:ui])\n
  (reset! webapp.framework.client.system-globals/start-component  main)")










(defn reeval [app-id]
  (go
    (let [code (js/getCodeMirrorValue)]
      (remote !savecode {:id app-id :code code})
      (swap! ns-counter inc)
      (js/sendcode (str (start) code (end) ))
      )))



(defn evalapp [app-id]
  (go
;    (js/alert (str app-id))
    (let [x (remote  !getfilecontents  {:id app-id })]
      (swap! ns-counter inc)
      (js/sendcode (str (start) (:value x) (end) ))
      )))







(defn-ui-component     view-app-component   [app]
  {:on-mount
   (do  (go
          ;(remote !loadapp {:id (read-ui app [:app-id] )})
          ;(js/alert "loaded")
          ))}

  (iframe {:id "appframe" :style {:display "inline-block"}
           :src
           (str (cond
                  @c/debug-mode
                  "http://127.0.0.1:3449"

                  :else
                  "http://appshare.co/appshare")
                "/devclient.html") :width "600" :height "800"}))







(defn-ui-component     editor-component   [app]
  {:on-mount
   (do  (go
          (if  (read-ui app [:app-id])
              (let [x (remote  !getfilecontents  {:id (read-ui app [:app-id]) })]

                (js/createEditor)
                (js/populateEditor (get x :value))
                ;(reeval (read-ui app [:app-id]))
                ;(js/populateEditor (str "Loaded: " (read-ui app [:app-id])))

                ))))}


  (div {}
       (realtime select id, application_name from coils_applications where id = ? {:params [(read-ui app [:app-id])]}
                 (cond
                   (and (= (read-ui app [:submode]) "editappname") (= (<-- :id ) (read-ui app [:app-id])))
                   (input-field {:style {:marginBottom "20px" :color "black"} :placeholder  (str (<-- :application_name))}
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


                   ; if we select a different app
                   :else
                   (do
                     (div {:onClick     #(go  (write-ui app [:submode] "editappname")
                                              (write-ui app [:app-id] (<-- :id))
                                              )

                           :style {:display "inline-block" :fontFamily "Ubuntu" :fontWeight "700" :fontSize "1.3em" ::marginTop "0.7em"}}
                          (str (<-- :application_name)))))
       )
       (textarea {:id "cm" :style {:display "inline-block" :width "1200" :height "800"}} "TEXT EDITOR")))












(defn-ui-component     browser-component   [app]  {}


  (div {:style {:margin "30px"}}
       (realtime select id, application_name from coils_applications order by id {}
               (div nil


                    (comment button {:style {:marginRight "30px" :marginBottom "10px"}
                             :className "btn btn-small"
                             :onClick     #(go (sql "delete from coils_applications
                                              where id = ?"
                                              [(<-- :id) ]))
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


                      ; if we select a different app
                      :else
                      (do
                        (div {:onClick     #(go  (write-ui app [:mode] "view")
                                                 ;(write-ui app [:submode] "editappname")
                                                 (write-ui app [:app-id] (<-- :id))
                                                 (evalapp (<-- :id))
                                                 )

                              :style {:display "inline-block" :fontFamily "Ubuntu" :fontWeight "700" :fontSize "1.3em" ::marginTop "0.7em"}}
                             (str (<-- :application_name)))))






                    ))))















(defn-ui-component     main-hosting-component   [app]
  {}


  (div nil
       (div {:style     {:border "0px" :backgroundColor "black" :width "100%" :height "3em" :verticalAlign "top"}}
            (img {:style {:display "inline-block" :marginTop "-0.0em"} :src "appshare_logo_dark_background.png"})

            (button {:className    "btn-lg btn-default"
                     :style       {:display "inline-block" :marginLeft "30px" :fontFamily "Ubuntu" :fontSize "1em" :marginTop "-0.3em"}
                     :onClick     #(write-ui app [:mode] "browse")} "Home")

            (button {:className    "btn-lg btn-default"
                     :style       {:display "inline-block" :marginLeft "30px" :fontFamily "Ubuntu" :fontSize "1em" :marginTop "-0.3em"
                                   :opacity (if (or (= (read-ui app [:mode]) nil) (= (read-ui app [:mode]) "browse")) "1.0" "0.4")
                                   }
                     :disabled  (if (or (= (read-ui app [:mode]) nil) (= (read-ui app [:mode]) "browse")) "" "true")
                     :onClick     #(go
                                      (remote !newapp {})) } "New")

            (button {:style {:marginBottom "10px" :marginLeft "30px"

                             :opacity  (if (= (read-ui app [:mode]) "view")  "1.0" "0.4")

                             } :className "btn-lg btn-default"
                             :onClick     #(go (write-ui app [:mode] "edit")
                                             ;(remote !loadapp {:id (read-ui app [:app-id])})
                                             )
                     :disabled  (if (= (read-ui app [:mode]) "view") "" "true")

                             } "Edit")


            (cond
             (= (read-ui app [:mode]) "edit")
             (div {:style       {:display "inline-block"}}
               (comment a {:className    "btn btn-default"
                   :target       "new"
                   :style       {:display "inline-block" :marginLeft "30px" :fontFamily "Ubuntu" :fontSize "1em"  :marginTop "-0.3em" }
                   :href         (str "http://" @appshare-dev-server ":3450")}
                  "Run in own window")

               ))



            (button {:className    "btn-lg btn-default"
                        :style       {:display "inline-block" :marginLeft "30px" :fontFamily "Ubuntu" :fontSize "1em" :marginTop "-0.3em"
                                      :opacity  (if (= (read-ui app [:mode]) "edit")  "1.0" "0.4")

                                      }
                        :onClick     #(do
                                        (write-ui app [:mode] "view")
                                        (reeval  (read-ui app [:app-id])))
                     :disabled  (if (= (read-ui app [:mode]) "edit") "" "true")
                     }
                       "Save")

            (a {:target       "appshare.co"
                :style       {:textDecoration "underline" :float "right"  :display "inline-block" :marginRight "30px" :fontFamily "Ubuntu" :fontSize "2em" :marginTop "0.3em"}
                :href         (str "https://github.com/zubairq/AppShare")}
               "AppShare on Github"))


;       (div {} (str "mode: " (read-ui app [:mode])))
;       (div {} (str "sub-mode: " (read-ui app [:sub-mode])))
;       (div {} (str "app-id: " (read-ui app [:app-id])))


       (div {:style {:display "inline-block" :width "1200" :height "800" :verticalAlign "top"}}

            (cond

              (or (= (read-ui app [:mode]) nil) (= (read-ui app [:mode]) "browse"))
              (div {:style {}} (component browser-component app []))


              (= (read-ui app [:mode]) "edit")
              (div {:style {} } (component editor-component app []))

            )


            (div {:style {:display (if (= (read-ui app [:mode]) "view") "" "none")}} (component  view-app-component  app [])))


       ))







(def-coils-app     main-view   main-hosting-component)

