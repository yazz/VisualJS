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
                                               input-field remote add-many map-many
                                               ]])
  (:use
   [myappshare.login :only  [login-component]]
   [myappshare.glyphs :only  [glyphs]]
   [myappshare.join :only  [join-component]]
   [myappshare.your-account :only  [your-account-component]]
   [myappshare.edit-data :only  [edit-data-component]]
   [webapp.framework.client.system-globals :only  [client-session-atom  can-use-interfaces  debug-mode   app-state]]
    )

  (:require-macros
   [cljs.core.async.macros :refer [go alt!]]))
(ns-coils 'myappshare.mainapp)




(defn small-screen [] (if (< (js/width) 1024) true false))

(defn large-screen [] (not (small-screen)))







(def ns-counter (atom 0))

(defn start [] (str "(ns webapp.framework.client.fns" @ns-counter "\n
  (:require-macros
    [webapp.framework.client.macros :refer [
                    refresh  ns-coils   div button input span defn-ui-component component
                    map-many  add-many <--  data-view-v2  sql-parser  select
                    remote-sql-parser sql realtime
                    data-view-result-set section h1 h2 h3 h4 h5 h6
                    input-field read-ui write-ui container label remote
                    ]]))
(ns-coils 'webapp.framework.client.fns " @ns-counter ")"))
(defn end [] "(webapp.framework.client.system-globals.touch [:ui])\n
  (reset! webapp.framework.client.system-globals/start-component  main)")










(defn reeval [app-id   calling-app-id]
  (go
     ;(js/alert (str "(get @app-state :editor):" (get @app-state :editor)))
    (let [
           code             (cond
                              (= (get @app-state :editor)  "text")
                                     (js/getCodeMirrorValue)

                              (= (get @app-state :editor)  "blockly")
                                     (js/getBlocklyValue))

           blockly-xml      (if (= (get @app-state :editor)  "blockly")
                              (js/getBlocklyXml))

           app-session-id   (str (js/getappsessionid) )
           ]

      (if
        (= (get @app-state :editor)  "text")
        (do
          (remote !savecode {:id                 app-id
                             :code               (subs code 0 2000)
                             :app-session-id     app-session-id})

          (remote !savecode2 {:id               app-id
                              :code             (subs code 2000 4000)
                              :app-session-id   app-session-id})))


      (if blockly-xml
        (remote !save-blockly-xml {:id                 app-id
                                   :xml               (subs blockly-xml 0 1000)
                                   :code              (subs code 0 1000)
                                   :app-session-id     app-session-id}))

      (swap! ns-counter inc)
      (js/sendcode  (str (start) code (end))
                    calling-app-id
                    ;"reevalapp"
                    (clj->js "REV first one"
                             )
                    )
      )))






(defn evalapp [app-id   calling-app-id   args]
  (go
    ;(js/alert (str app-id))
    (let [
           app-session-id   (str (js/getappsessionid))
           app-code         (remote  !getfilecontents  {:calling-from-application-id          calling-app-id
                                                        :running-application-id               app-id
                                                        :app-session-id                       app-session-id})
           code-format      (:code-format   app-code)
           ]
      ;(js/alert (pr-str "HOST SESSION ID: "   (:session-id @client-session-atom)))
      ;(js/alert (pr-str "CLIENT SESSION ID: " (js/getappsessionid)))
      ;(js/alert (pr-str "Code format: " code-format))
      (cond
        (= code-format "blockly") (swap! app-state assoc :editor "blockly")
        :else (swap! app-state assoc :editor "text"))
      (reset! can-use-interfaces (:can-use-interfaces app-code))
      (js/callresetclientstate    app-session-id)
      (swap! ns-counter inc)
      (js/sendcode (str (start)
                        (:value app-code)
                        (end))
                   calling-app-id
                   (clj->js ;["a" "b" {:d 1 :r "sfs"}]
                            "first one"
                            )
                   ))))








(defn-ui-component     view-app-component   [app]
  {:on-mount
   (do  (go
          ;(remote !loadapp {:id (read-ui app [:app-id] )})
          ;(js/alert "loaded")
          ))}

  (iframe {:id "appframe" :frameBorder "0"
           :style {:display "inline-block"}
           :src
           (str (cond
                  @debug-mode
                  "http://127.0.0.1:3449"

                  :else
                  "http://appshare.co/appshare")
                "/devclient.html") :width "600" :height "800"}))










(defn-ui-component     edit-app-glyph-component   [app]
  (div {:style {:margin "20px"}}
       (map-many
         #(span {:style {:margin "10px"}
                 :className (str "glyphicon " %1)
                 :aria-hidden "true"
                 :onClick     (fn [x]
                                (go
                                  (remote  !saveappglyph  {:id (read-ui app [:app-id])  :glyph (str %1)})
                                  (write-ui app [:mode] "edit")))
                } "")
         glyphs)


       (button {:style { :marginRight "30px" :marginBottom "10px" :marginTop "20px"}
                :className "btn-lg btn-default"
                :onClick     #(go
                                (write-ui app [:mode] "edit"))}
               "Cancel")

       ))





(defn add-blocks [section-name  block-names]
  (let [xxx (fn [e]
              (do
              (js/uuuttt
                (str "<xml>"
                     (apply str
                            (map (fn [x] (str "<block type=\"" x "\"></block>"))
                                 block-names))
                     "</xml>")))
              (swap! app-state assoc :blockly-category section-name)
              )]
    (div {
           :onMouseOver  xxx
           :onTouchStart  xxx
           :style {:backgroundColor
                   (if (= (get @app-state :blockly-category) section-name) "darkgray" "lightgray")}
           }
         section-name)))



(defn-ui-component     blockly-editor-component   [app]
  {:on-mount
   (do  (go
          (js/initBlockly)
          (if  (read-ui app [:app-id])
            (let [app-session-id    (str (js/getappsessionid))

                  x                 (remote  !getfilecontents  {:calling-from-application-id     (read-ui app [:app-id])
                                                                :running-application-id          (read-ui app [:app-id])
                                                                :app-session-id                  app-session-id})]

              (js/setBlocklyXml (str (:blockly x)))
              ))


          ))}


  (div {:style {:background "white" :width "100%"  :height "800px" :align "top" :top "100px"  }}




       (div {:id "blocklyCategorySelector" :style {:background "lightgrey"
                                                   :color "black"
                                                   :height "800px"
                                                   :width "100px"
                                                   :display "inline-block"
                                                   :verticalAlign "text-top"}}
            (add-blocks "Samples"  ["appshare_samples_helloworld"])


            (add-blocks "Quick"     ["appshare_quick_app"])

            ;(add-blocks "Forms"    ["appshare_basic_form"])

            (add-blocks "Easy"     ["appshare_app"
                                    "appshare_ui_component"
                                    "appshare_div"
                                    "appshare_no_attributes"
                                    "appshare_element_attribute"
                                    "appshare_element_text"])

            )




       (div {:id "blocklyDiv" :style {:verticalAlign "text-top"
                                      :background     "white"
                                      :color          "white"
                                      :height         "800px"
                                      :width          "500px"
                                      :display        "inline-block"}} "")

       (pre {:id "blocklyCode" :style {:verticalAlign "text-top"
                                       :background     "white"
                                       :color          "black"
                                       :height         "800px"
                                       :width          "500px"}} "")))




(defn-ui-component     text-editor-component   [app]
  {:on-mount
   (do  (go
          (if  (read-ui app [:app-id])
            (let [app-session-id    (str (js/getappsessionid))

                  x                 (remote  !getfilecontents  {:calling-from-application-id     (read-ui app [:app-id])
                                                                :running-application-id          (read-ui app [:app-id])
                                                                :app-session-id                  app-session-id})

                  user-can-edit-app (:value (remote  !user-can-edit-app?  {:id             (read-ui app [:app-id])
                                                                           :session-id     (:session-id @client-session-atom)}))]

              (js/createEditor)
              (js/populateEditor (get x :value))

              (if user-can-edit-app
                (js/setCodeMirrorOption "readOnly" false)
                (js/setCodeMirrorOption "readOnly" true))



              ))))}


  (div {}
         (textarea {:id "cm" :style {:width "600px" :height "800" :display "inline-block" }} "TEXT EDITOR")

       ))





(defn-ui-component     editor-component   [app]   {}


  (div {}
       (realtime select   id, application_name, application_glyph
                 from appshare_applications where id = ? {:params [(read-ui app [:app-id])]}

                 (div {:style {:marginLeft "20px" :padding "5px"}}
                      (cond
                        (= (read-ui app [:editor]) "text")
                        (span {:onClick #(go  (write-ui app [:editor] "blockly"))} "Text | ")

                        (or (= (read-ui app [:editor]) "blockly") (= (read-ui app [:editor]) nil))
                        (span {:onClick #(go  (write-ui app [:editor] "text"))} "Blockly | ")
                        )


                      (if (get @can-use-interfaces "edit.my.database")
                        (span {:onClick #(go  (let [old-app-id   (read-ui app [:app-id])]
                                                (write-ui app [:mode] "view")
                                                (write-ui app [:app-id] (get @can-use-interfaces "edit.my.database"))
                                                (evalapp (get @can-use-interfaces "edit.my.database")   old-app-id nil))
                                              )} "Data | "))




                      (let [glyphicon (if (<-- :application_glyph)  (<-- :application_glyph) "glyphicon-align-left")]
                        (span {:onClick #(go  (write-ui app [:mode] "editappglyph"))
                               :className (str "glyphicon " glyphicon)
                               :aria-hidden "true"} ""))

                      (span nil " | ")

                      (cond
                        (and (= (read-ui app [:submode]) "editappname") (= (<-- :id ) (read-ui app [:app-id])))
                        (span nil
                              (input-field {:style {:marginLeft "20px" :color "black"} :placeholder  (str (<-- :application_name))}
                                           app
                                           (fn [new-name]
                                             (let [id (read-ui app [:app-id])]
                                               (go
                                                 (sql "update  appshare_applications
                                                      set application_name = ?
                                                      where id = ?"
                                                      [new-name id ]  )
                                                 ;(js/alert (str new-name ":" id))
                                                 (write-ui app [:submode] nil)
                                                 ))))
                              (span {:style {:marginLeft "20px" :color "white"} } "<<< Type new name and press Enter" ))


                        ; show the name of the app
                        :else
                        (do
                          (span {:onClick     #(go  (write-ui app [:submode] "editappname")
                                                    (write-ui app [:app-id] (<-- :id))
                                                    )}
                                (div {

                                       :style {:display      "inline-block"
                                               :fontFamily   "Ubuntu"
                                               :fontWeight   "700"
                                               :fontSize     "1.3em"
                                               :marginLeft "20px"}}

                                     (str (<-- :application_name)))
                                (span {:style {:marginLeft "20px" :color "white"} } "<<< Click to edit name" )
                                )))))
       (cond
         (= (read-ui app [:editor]) "text")
         (component  text-editor-component  app  [])

         (or (= (read-ui app [:editor]) "blockly") (= (read-ui app [:editor]) nil))
         (component  blockly-editor-component  app  [])
         )
       ))






(defn-ui-component     application-list-item-component   [app-list-item]  {}
 (select id, publisher_name from appshare_publishers where id = ? {:params [(read-ui app-list-item [:value :fk_appshare_publisher_id])]}
                                                (str  (first (clojure.string/split (<-- :publisher_name) "@"))  )))






(defn-ui-component     browser-component   [app]  {}


  (div {:style {:marginLeft "5px"}}
       (div {:style {:display "inline-block" :fontFamily "Ubuntu" :fontSize "1em"}}
               "Build an app in 5 minutes")

  (div {:style {:marginLeft "25px"}}
       (realtime select id, application_name, application_glyph, fk_appshare_publisher_id from appshare_applications order by id
                 {;:relative-path ["applications"]
                  }
               (div nil


                    (comment button {:style { :marginRight "30px" :marginBottom "10px"}
                             :className "btn btn-small"
                             :onClick     #(go (sql "delete from appshare_applications
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
                                         (sql "update  appshare_applications
                                              set application_name = ?
                                              where id = ?"
                                              [new-name id ]  )
                                         ;(js/alert (str new-name ":" id))
                                         (write-ui app [:submode] nil)
                                         ))))


                      ; if we select a different app
                      :else
                      (let [glyphicon (if (<-- :application_glyph)  (<-- :application_glyph) "glyphicon-align-left")]
                        (span {:className (str "glyphicon " glyphicon)
                               :aria-hidden "true"
                               :onClick     #(go  (write-ui app [:mode] "view")
                                                       ;(write-ui app [:submode] "editappname")
                                                       (write-ui app [:app-id] (<-- :id))
                                                       (evalapp (<-- :id) nil nil)
                                                       )
                                 }
                              (span {

                                    :style {:display "inline-block" :fontFamily "Ubuntu" :fontWeight "700" :fontSize "1.3em" :marginTop "0.7em" :marginLeft "0.7em"}}
                                   (str   (<-- :application_name)))

                              (if (<-- :fk_appshare_publisher_id) (span {:style {:display "inline-block" :fontFamily "Ubuntu" :fontWeight "700" :fontSize "1.3em" :marginTop "0.7em" :marginLeft "0.7em"}}

                                                                        ;(component  application-list-item-component  app  ["applications" :values  (<-- :id)])

                                                                          (select id, publisher_name from appshare_publishers where id = ? {:params [(<-- :fk_appshare_publisher_id)]
                                                                                                                                            ;:relative-path (conj (conj relative-path :values)  (<-- :id))
                                                                                                                                            }
                                                                                  (str  (first (clojure.string/split (<-- :publisher_name) "@"))))))))))))))








(defn-ui-component     main-hosting-component   [app]
  {}


  (div nil
       (div {:style     {:border "0px" :backgroundColor "black" :width "100%" :height "3em" :verticalAlign "top"}}
            (if (large-screen) (img {:style {:display "inline-block" :marginTop "-0.0em"} :src "appshare_logo_dark_background.png"}))

            (button {:className    (if (small-screen) "btn btn-default" "btn-lg btn-default")
                     :style       {:display "inline-block" :marginLeft (if (small-screen) "2px"  "30px") :fontFamily "Ubuntu" :fontSize "1em" :marginTop "0.3em"}
                     :onClick     #(do
                                     (write-ui app [:mode] "browse")
                                     (write-ui app [:submode] "")
                                     )} "Home")

            (button {:className    (if (small-screen) "btn btn-default" "btn-lg btn-default")
                     :style       {:display "inline-block" :marginLeft (if (small-screen) "2px"  "30px") :fontFamily "Ubuntu" :fontSize "1em" :marginTop "0.3em"
                                   :opacity (if (or (= (read-ui app [:mode]) nil) (= (read-ui app [:mode]) "browse")) "1.0" "0.4")
                                   }
                     :disabled  (if (or (= (read-ui app [:mode]) nil) (= (read-ui app [:mode]) "browse")) "" "true")
                     :onClick     #(go
                                      (let [resp (remote !newapp {:session-id (:session-id @client-session-atom)})]
                                        (if (:id resp)
                                          (do
                                            (write-ui app [:mode] "edit")
                                            (write-ui app [:app-id] (:id resp))
                                            (if (large-screen) (do (reeval  (:id resp) nil)))
                                            )
                                          )
                                        )) } "New")




(cond
  (not (= (read-ui app [:mode]) "edit"))
            (button {:className    (if (small-screen) "btn btn-default"  "btn-lg btn-default")
                     :style {:display "inline-block" :marginLeft (if (small-screen) "2px"  "30px")
                             :fontFamily "Ubuntu"    :fontSize "1em"       :marginTop "0.3em"
                             :opacity  (if (= (read-ui app [:mode]) "view")  "1.0" "0.4")
                             }
                     :onClick     #(go (write-ui app [:mode] "edit"))
                     :disabled     (if (= (read-ui app [:mode]) "view") "" "true")
                     } "Edit")


  (= (read-ui app [:mode]) "edit")
            (button {:className    (if (small-screen) "btn btn-default"  "btn-lg btn-default")
                     :style       {:display "inline-block"
                                   :marginLeft (if (small-screen) "2px"  "30px")
                                   :fontFamily "Ubuntu" :fontSize "1em" :marginTop "0.3em"
                                   :backgroundColor "lightgreen"
                                   :opacity  (if (= (read-ui app [:mode]) "edit")  "1.0" "0.4")

                                   }
                     :onClick     #(do
                                     (if (small-screen) (write-ui app [:mode] "view"))
                                     (reeval  (read-ui app [:app-id]) nil))
                     :disabled  (if (= (read-ui app [:mode]) "edit") "" "true")
                     }
                    "Play!"
                    (span {:style {:marginLeft "4px"}
                           :className (str "glyphicon glyphicon-play")
                           :aria-hidden "true"})
                    )
)


            (button {:className    (if (small-screen) "btn btn-default"  "btn-lg btn-default")
                     :style       {:display "inline-block" :marginLeft (if (small-screen) "2px"  "30px") :fontFamily "Ubuntu" :fontSize "1em" :marginTop "0.3em"
                                   :opacity  (if (or (= (read-ui app [:mode]) "join") (= (read-ui app [:mode]) "account"))  "0.4" "1.0")

                                   }
                     :onClick     #(do
                                     (if (:user @client-session-atom) (write-ui app [:mode] "account") (write-ui app [:mode] "join"))
                                     )
                     :disabled  (if (= (read-ui app [:mode]) "join") "true" "")
                     }
                    (str (if (get @client-session-atom :user) (get-in @client-session-atom [:user :user_name]) "Join")))


            (button {:className    (if (small-screen) "btn btn-default"  "btn-lg btn-default")
                     :style       {:display "inline-block" :marginLeft (if (small-screen) "2px"  "30px") :fontFamily "Ubuntu" :fontSize "1em" :marginTop "0.3em"
                                   :opacity  (if (= (read-ui app [:mode]) "login")  "0.4" "1.0")

                                   }
                     :onClick     #(do
                                     (if (:user @client-session-atom)
                                       (go
                                         (remote !logout-session {:session-id (:session-id @client-session-atom)})
                                         (swap! client-session-atom assoc :user nil)
                                         (write-ui app [:mode] "browse")
                                         )
                                       (write-ui app [:mode] "login"))
                                     )
                     :disabled  (if (= (read-ui app [:mode]) "login") "true" "")
                     }
                    (if (:user @client-session-atom) "Logout" "Login")))



;       (div {} (str "mode: " (read-ui app [:mode])))
;       (div {} (str "sub-mode: " (read-ui app [:sub-mode])))
;       (div {} (str "app-id: " (read-ui app [:app-id])))


       (div {:style {:display "inline-block" :width "100%" :height "600px" :verticalAlign "top"}}

            (cond

              (or (= (read-ui app [:mode]) nil) (= (read-ui app [:mode]) "browse"))
              (div {:style {}} (component browser-component app []))


              ;(or (and (= (read-ui app [:mode]) "view") (large-screen)) (= (read-ui app [:mode]) "edit"))
              (= (read-ui app [:mode]) "edit")
              (div {:style {:display "inline-block"  :width "600px" :verticalAlign "top"} } (component editor-component app []))

              (= (read-ui app [:mode]) "editappglyph")
              (div {:style {} } (component edit-app-glyph-component app []))


              (= (read-ui app [:mode]) "join")
              (div {:style {} } (component join-component app []))

              (= (read-ui app [:mode]) "login")
              (div {:style {} } (component login-component app []))

              (= (read-ui app [:mode]) "account")
              (div {:style {} } (component your-account-component app []))
            )


            (div {:style {:display (if
                                     (or (= (read-ui app [:mode]) "view")
                                         (and (= (read-ui app [:mode]) "edit") (large-screen)))
                                     "inline-block" "none") :width "600px" :verticalAlign "top" :paddingTop "40px"} }
                 (component  view-app-component  app [])))


       ))







(def-coils-app     main-view   main-hosting-component)

