(ns myappshare.mainapp
  (:require
   [webapp.framework.client.coreclient   :as c ]
   [om.core :as om :include-macros true]
   [cljs.core.async  :refer [put! chan <! pub timeout]])

  (:use-macros
   [webapp.framework.client.coreclient  :only [defn-ui-component def-coils-app
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
   [webapp.framework.client.system-globals :only  [client-session-atom  can-use-interfaces  debug-mode   app-state  touch]]
    )

  (:require-macros
   [cljs.core.async.macros :refer [go alt!]]))




(defn small-screen [] (if (< (js/width) 1024) true false))

(defn large-screen [] (not (small-screen)))







(def ns-counter (atom 0))
(def in-eval (atom false))

(defn start [] (str "(ns webapp.framework.client.fns" @ns-counter "\n
  (:require-macros
    [webapp.framework.client.macros :refer [
                    refresh  div button input span defn-ui-component component
                    map-many  add-many <--  data-view-v2  sql-parser  select
                    remote-sql-parser sql realtime
                    data-view-result-set section h1 h2 h3 h4 h5 h6
                    input-field read-ui write-ui container label remote
                    ]]))
(defn-ui-component     default-component   [app] (div nil))
"))
(defn end [] "(webapp.framework.client.system-globals.touch [:ui])\n
  (reset! webapp.framework.client.system-globals/start-component  main)")





(defn start-optimized [] (str "(ns webapp.framework.client.fns" @ns-counter "\n
  )


(defn default-component [inpi  owner]
    (reify
          om.core/IRender
          (render [this]

                    (let [
                            ui-state   inpi

                            return-val (webapp.framework.client.coreclient/debug-react
                                          \"default-component\"
                                          owner
                                          inpi
                                          (fn [inpi]
                                                (om.dom/div nil \"default-component\")
                                          [ ]
                                          ))
                            ]

                      return-val))))"))


(defn end-optimized [] "(webapp.framework.client.system-globals.touch [:ui])\n
  (reset! webapp.framework.client.system-globals/start-component  main)")





(def current-toolbox (atom ""))


(def basic-blocks  [
                     ["appshare_element_header" "ui"]
                     ["appshare_element_text" "ui"]
                     ["appshare_element_br" "ui"]
                     ["appshare_element_box" "ui"]
                     ["appshare_element_left_padding" "ui"]
                     ["appshare_element_top_padding" "ui"]
                     ["appshare_custom_component" "component"]
                     ["appshare_call_custom_component" "ui"]
                     ["appshare_db_component" "ui"]
                     ])




(defn show-blocks [section-name   block-names ]
  (let [this-toolbox   (str "<xml>"
                            (apply str
                                   (map (fn [x] (str
                                                  "<block "
                                                      "type=\"" (first x) "\" "
                                                  ">"
                                                      "<data>" (second x) "</data>"
                                                  "</block>"))
                                        block-names))
                            "</xml>")]
    (js/uuuttt  this-toolbox)
    (reset! current-toolbox  this-toolbox)
    (swap! app-state assoc :blockly-category section-name)
    )
  )



(defn reeval [app-id   calling-app-id]
  (if (not @in-eval)
  (go
    (reset! in-eval true)
    ;(js/alert (str "(get @app-state :ui :editor :mode):" (get @app-state :ui :editor :mode)))
    (let [
           code             (cond
                              (= (get-in @app-state [:ui :editor :mode])  "text")
                              (js/getCodeMirrorValue)

                              (= (get-in @app-state [:ui :editor :mode])  "blockly")
                              (js/getBlocklyValue))

           app-code-value-optimized         (cond
                                              (= (get-in @app-state [:ui :editor :mode])  "blockly")
                                              (js/getBlocklyValueOptimized))

           blockly-xml      (if (= (get-in @app-state [:ui :editor :mode])  "blockly")
                              (js/getBlocklyXml))

           app-session-id   (str (js/getappsessionid) )
           ]

      (if
        (= (get-in @app-state [:ui :editor :mode])  "text")
        (do
          (remote !savecode {:id                 app-id
                             :code               (subs code 0 2000)
                             :app-session-id     app-session-id})

          (remote !savecode2 {:id               app-id
                              :code             (subs code 2000 4000)
                              :app-session-id   app-session-id})))


      (if blockly-xml
        (do
          (remote !savecode {:id                 app-id
                             :code               (subs code 0 2000)
                             :app-session-id     app-session-id})

          (remote !savecode2 {:id               app-id
                              :code             (subs code 2000 4000)
                              :app-session-id   app-session-id})
          (remote !saveblockly {:id                 app-id
                             :code               (subs blockly-xml 0 2000)
                             :app-session-id     app-session-id})

          (remote !saveblockly2 {:id               app-id
                              :code             (subs blockly-xml 2000 4000)
                              :app-session-id   app-session-id})
          )


        )

      (swap! ns-counter inc)
      ;(js/alert (str  @ns-counter))
      (touch [:ui])
      (cond
        (= (get-in @app-state [:ui :editor :mode])  "blockly")
        (js/sendcode  (str (start-optimized) app-code-value-optimized (end-optimized))
                      calling-app-id
                      ;"reevalapp"
                      (clj->js "REV first one"))

        :else
        (js/sendcode  (str (start) code (end))
                      calling-app-id
                      ;"reevalapp"
                      (clj->js "REV first one")))
      (reset! in-eval false)
      ))))














(defn evalapp [app-id   calling-app-id   args]
  (if (not @in-eval)
  (go
    (reset! in-eval true)
    ;(js/alert (str app-id))
    (let [
           app-session-id   (str (js/getappsessionid))
           app-code-resp    (remote  !getfilecontents  {:calling-from-application-id          calling-app-id
                                                        :running-application-id               app-id
                                                        :app-session-id                       app-session-id})
           code-format      (:code-format   app-code-resp)

           app-code-value         (cond
                                    (= code-format "blockly")
                                    (do
                                      (js/setBlocklyXml  (:blockly app-code-resp))
                                      (js/getBlocklyValue))

                                    :else
                                    (:value app-code-resp))

           app-code-value-optimized         (cond
                                              (= code-format "blockly")
                                              (js/getBlocklyValueOptimized))

           user-can-edit-app (:value (remote  !user-can-edit-app?  {:id             app-id
                                                                    :session-id     (:session-id @client-session-atom)}))

           ]
      ;(js/alert (pr-str "HOST SESSION ID: "   (:session-id @client-session-atom)))
      ;(js/alert (pr-str "CLIENT SESSION ID: " (js/getappsessionid)))
      ;(js/alert (pr-str "Code format: " code-format))
      ;(js/alert (pr-str "app-code-value: " js/Blockly.ClojureScript.valueToCode ))

      (cond
        (= code-format "blockly")
        (do
          (swap! app-state assoc-in [:ui :editor :mode] "blockly")
          ;(js/alert  (str (:blockly app-code-resp)))
          (js/setBlocklyXml (str (:blockly app-code-resp)))
          (js/populateEditor app-code-value)
          )

        :else
        (do
          (swap! app-state assoc-in [:ui :editor :mode] "text")
          (js/populateEditor app-code-value)

          (if user-can-edit-app
            (js/setCodeMirrorOption "readOnly" false)
            (js/setCodeMirrorOption "readOnly" true)))

        )

      (reset! can-use-interfaces (:can-use-interfaces app-code-resp))
      (js/callresetclientstate    app-session-id)
      (swap! ns-counter inc)
      (cond
        (= code-format "blockly")
        (js/sendcode (str (start-optimized)
                          app-code-value-optimized
                          (end-optimized))
                     calling-app-id
                     (clj->js ;["a" "b" {:d 1 :r "sfs"}]
                       "first one"))

        :else
        (js/sendcode (str (start)
                          app-code-value
                          (end))
                     calling-app-id
                     (clj->js ;["a" "b" {:d 1 :r "sfs"}]
                       "first one")))

      (reset! in-eval false)

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
                                  (remote  !saveappglyph  {:id (get-in @app-state [:app-id])  :glyph (str %1)})
                                  (swap! app-state assoc-in [:mode] "edit")))
                } "")
         glyphs)


       (button {:style { :marginRight "30px" :marginBottom "10px" :marginTop "20px"}
                :className "btn-lg btn-default"
                :onClick     #(go
                                (swap! app-state assoc-in [:mode] "edit"))}
               "Cancel")

       ))








(defn  ^:export refreshapp []
  (do
    (reeval (get @app-state :app-id) nil)
    ;(show-blocks  "Basic"  basic-blocks)
    ))





(defn add-blocks [section-name  block-names]

    (div {
           :onClick  (fn [e] (do (show-blocks  section-name  block-names)
                                       (js/setTimeout (fn [ee] (touch [:ui :editor])) 100)))
           :onTouchStart  (fn [e] (do (show-blocks  section-name  block-names)
                                       (js/setTimeout (fn [ee] (touch [:ui :editor])) 100)))

           :style {:display "inline-block"
                   :padding "10px"
                    :backgroundColor
                   (if (= (get @app-state :blockly-category) section-name) "darkgray" "lightgray")}
           }
         section-name))




(defn ^:export inEval []
  @in-eval)


(defn ^:export dooo []
  (show-blocks  "Basic"  basic-blocks))

(defn ^:export calcEvals []
  @ns-counter)


(defn-ui-component     blockly-editor-component   [app]
  {:on-mount
   (do  (go
          (js/initBlockly)
          ))

   }


  (div nil


       (div {:id "blocklyCategorySelector" :style {:background "lightgrey"
                                                   :color "black"
                                                   :height "50px"
                                                   :fontSize "15px"
                                                   :verticalAlign "text-top"}
             :onMouseOver (fn[ee]
                            (if @current-toolbox (js/uuuttt  @current-toolbox))
                            )
             }


            (div {
                   :onClick  (fn [e] (js/clearBlockly))
                   :onTouchStart  (fn [e] (js/clearBlockly))

                   :style {:display "inline-block"
                           :padding "10px"
                           :backgroundColor "gray" }
                   }
                 "Clear")
            ;(add-blocks "Forms"    ["appshare_basic_form"])

            (add-blocks "Basic"     basic-blocks)




            (comment add-blocks "Text"     [  ["appshare_div" "ui"]
                                      ["appshare_no_attributes" "ui"]
                                      ["appshare_element_attribute" "ui"]
                                      ["appshare_element_text" "ui"]])

            (comment add-blocks "Shapes"   [])

            (add-blocks "Coming soon"  [ ["appshare_ui_component" "ui"]
                                    ["appshare_div" "ui"]
                                    ["appshare_no_attributes" "ui"]
                                    ["appshare_element_attribute" "ui"]
                                    ["appshare_element_text" "ui"]])



            )


    (div {:style {
                   :display (if (or (= (get-in @app-state [:ui :editor :mode]) "blockly")
                                    (= (get-in @app-state [:ui :editor :mode]) nil))
                              "inline-block"
                              "none")

                   :background2 "white" :width "100%"  :height "800px" :align "top" :top "100px"  }}










         (div {:id "blocklyDiv" :style {:verticalAlign "text-top"
                                        :background     "white"
                                        :color          "white"
                                        :height         "800px"
                                        :width          "500px"
                                        :display        "inline-block"}} "")

         (div nil
               (button {
                         :onClick (fn[e] (swap! app-state assoc-in [:ui :editor :show-generated-code] true))
                         :className    (if (small-screen) "btn btn-default" "btn-lg btn-default")} "Show generated code")


              (div nil
                   (div {:id "numberOfEvals"} "...")
                   (pre {:id "blocklyCode" :style {:display (if (get-in @app-state [:ui :editor :show-generated-code])
                                                              ""
                                                              "none")
                                                   :verticalAlign "text-top"
                                                   :background     "white"
                                                   :color          "black"
                                                   :height         "800px"
                                                   :width          "500px"}}  "")))))
)









(defn-ui-component     text-editor-component   [app]
  {:on-mount
   (do  (go
              (js/createEditor)
              ))}


  (div {:style {:display (if (= (get-in @app-state [:ui :editor :mode]) "text") "inline-block" "none")}}
         (textarea {:id "cm" :style {:width "600px" :height "800" :display "inline-block" }} "TEXT EDITOR")

       ))















(defn-ui-component     editor-component   [app]   {}

  ;(or (and (= (read-ui app [:mode]) "view") (large-screen)) (= (read-ui app [:mode]) "edit"))

  (div {:style {:display (if (= (get-in @app-state  [:mode]) "edit") "inline-block" "none")}}
       (realtime select   id, application_name, application_glyph
                 from appshare_applications where id = ? {:params [(get-in @app-state [:app-id])]}

                 (div {:style {:marginLeft "20px" :padding "5px"}}
                      (cond
                        (= (get-in @app-state [:ui :editor :mode]) "text")
                        (span {:onClick #(go  (swap! app-state assoc-in [:ui :editor :mode] "blockly")
                                              (js/setTimeout js/refreshBlockly 500)
                                              (js/setTimeout (fn [ee] (touch [:ui :editor])) 500)
                                              )} "Text | ")

                        (or (= (get-in @app-state [:ui :editor :mode]) "blockly") (= (get-in @app-state [:ui :editor :mode]) nil))
                        (span {:onClick #(go  (swap! app-state assoc-in [:ui :editor :mode] "text")
                                              (js/setTimeout js/refreshCodeMirror 500)
                                              (js/setTimeout (fn [ee] (touch [:ui :editor])) 500)
                                              )} "Blockly | ")
                        )


                      (if (get @can-use-interfaces "edit.my.database")
                        (span {:onClick #(go  (let [old-app-id   (get-in @app-state [:app-id])]
                                                (swap! app-state assoc-in [:mode] "view")
                                                (swap! app-state assoc-in [:app-id] (get @can-use-interfaces "edit.my.database"))
                                                (evalapp (get @can-use-interfaces "edit.my.database")   old-app-id nil))
                                              )} "Data | "))




                      (let [glyphicon (if (<-- :application_glyph)  (<-- :application_glyph) "glyphicon-align-left")]
                        (span {:onClick #(go  (swap! app-state assoc-in [:mode] "editappglyph"))
                               :className (str "glyphicon " glyphicon)
                               :aria-hidden "true"} ""))

                      (span nil " | ")

                      (cond
                        (and (= (get-in @app-state [:submode]) "editappname") (= (<-- :id ) (get-in @app-state [:app-id])))
                        (span nil
                              (input-field {:style {:marginLeft "20px" :color "black"} :placeholder  (str (<-- :application_name))}
                                           app
                                           (fn [new-name]
                                             (let [id (get-in @app-state [:app-id])]
                                               (go
                                                 (sql "update  appshare_applications
                                                      set application_name = ?
                                                      where id = ?"
                                                      [new-name id ]  )
                                                 ;(js/alert (str new-name ":" id))
                                                 (swap! app-state assoc-in [:submode] nil)
                                                 ))))
                              (span {:style {:marginLeft "20px" :color "white"} } "<<< Type new name and press Enter" ))


                        ; show the name of the app
                        :else
                        (do
                          (span {:onClick     #(go  (swap! app-state assoc-in [:submode] "editappname")
                                                    (swap! app-state assoc-in [:app-id] (<-- :id))
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

       (div {:style {:display "inline-block"}}
            (component  blockly-editor-component  app  [:ui :editor])
            (component  text-editor-component  app  [:ui :editor])
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
                                            (if (large-screen) (do
                                                                 (evalapp  (:id resp) nil nil)))
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
                     :onClick     #(go (write-ui app [:mode] "edit")
                                       (do
                                         (js/setTimeout js/refreshBlockly 500)
                                         (js/setTimeout js/refreshCodeMirror 500)

                                       ))
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

            (div {:style {:display "inline-block" :verticalAlign "top"}}
                 (component editor-component app []))
            (div {:style {:display "inline-block" :verticalAlign "top"}}
                 (cond

                   (or (= (read-ui app [:mode]) nil) (= (read-ui app [:mode]) "browse"))
                   (div {:style {}} (component browser-component app []))



                   (= (read-ui app [:mode]) "editappglyph")
                   (div {:style {} } (component edit-app-glyph-component app []))


                   (= (read-ui app [:mode]) "join")
                   (div {:style {} } (component join-component app []))

                   (= (read-ui app [:mode]) "login")
                   (div {:style {} } (component login-component app []))

                   (= (read-ui app [:mode]) "account")
                   (div {:style {} } (component your-account-component app []))
                   ))


            (div {:style {:display "inline-block" :verticalAlign "top"}}
                 (div {:style {:display (if
                                          (or (= (read-ui app [:mode]) "view")
                                              (and (= (read-ui app [:mode]) "edit") (large-screen)))
                                          "inline-block" "none") :width "600px" :verticalAlign "top" :paddingTop "40px"} }
                      (component  view-app-component  app []))))


       ))







(def-coils-app     main-view   main-hosting-component)

