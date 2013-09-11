(ns webapp.client.loginpanel
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
        [cljs.core.async :as async :refer [chan close!]]
    )
    (:use
        [webapp.framework.client.coreclient :only [new-dom-id debug popup hide-popovers
                                                   show-popover set-text value-of find-el sql-fn neo4j-fn
                                                   swap-section el clear remote  add-to on-mouseover-fn on-click-fn]]
        [jayq.core                          :only [$ css  append fade-out fade-in empty attr bind]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
        [domina                             :only [ by-id value destroy! ]]
  )
  (:require-macros
    [cljs.core.async.macros :refer [go alt!]])
  (:use-macros
        [webapp.framework.client.eventbus :only [redefine-action define-action]]
        [webapp.framework.client.coreclient :only [ns-coils makeit defn-html on-click on-mouseover sql defn-html defn-html2 neo4j]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)
(ns-coils 'webapp.client.loginpanel)

;(ns-coils-debug)

(comment go
 ;(.log js/console (str (<! (sql "SELECT * FROM users " [] ))))
 (.log js/console (str (<! (neo4j "START x = node(11) RETURN x" {} ))))
)

;(makeit "fdsfd")

(define-action "Send me my password"
  (let
    [
       username    (message :username)
     ]
       (go
         (let [
                 search-db-for-user   (<! (sql "SELECT * FROM users where user_name = ?"
                                      [username] ))
                 user-already-exists  (pos? (count search-db-for-user))
              ]
                 (if user-already-exists
                     (do

                         (.log js/console "sending password")
                         (remote "send-password" {:username username})
                     )

                     (popup :title "Can't find you"
                            :body-html "<div>Try another email<div/>")
                  )
         )
  )
    ))






(defn-html forgot-password-panel-html []
  (el :form {:class "form-inline" :style "padding: 5px"}
      [
       (el :div {:class "form-group"} [
        "<input  id='username-input' type='email' class='input-small form-control' placeholder='Email'>"
        ])

       (el :button {
                     :id       "reset-password-button"
                     :type     "button"
                     :class    "btn btn-primary"
                     :style    "margin-left: 10px;"
                     :text     "Send me my password"
                     :onclick  #(do-action "Send me my password"
                                           {
                                            :username    (value-of "username-input")
                                            })})

        (el :button {
                     :type "button"
                     :class "btn btn-info"
                     :style "margin-left: 10px;"
                     :text "Cancel"
                     :onclick #(do-action "show login signup panel")})

      ]
  )
)








(defn-html login-panel-html []
  (el :form {:class "form-inline" :style "padding: 5px"}
      [
       (el :div {:class "form-group"} [
        "<input  id='username-input'  type='email' placeholder='me@example.com' class='input-small form-control'>"
        ])
       (el :div {:class "form-group"} [
        "<input  id='password-input' type='password' class='input-small form-control' placeholder='Password'>"
        ])
        ;"<div class='checkbox' style='margin-left: 10px;'>
        ;    <label>
        ;      <input type='checkbox'> Remember me
        ;    </label>
        ;  </div>"

       (el :button {
                     :id       "signup-button"
                     :type     "button"
                     :class    "btn btn-primary"
                     :style    "margin-left: 10px;"
                     :text     "Login"
                     :onclick  #(do-action "login user"
                                           {
                                            :username    (value-of "username-input")
                                            :password    (value-of "password-input")
                                            })})

        (el :button {
                     :type "button"
                     :class "btn btn-info"
                     :style "margin-left: 10px;"
                     :text "Cancel"
                     :onclick #(do-action "show login signup panel")})

      ]
  )
)







(defn-html signup-panel-html []
  (el :form {:class "form-inline" :role "form" :style "padding: 5px"}
      [
       (el :div {:class "form-group"} [
           "<input  id='username-input' type='email' class='input-small form-control' placeholder='Email'>"
        ])
       (el :div {:class "form-group"} [
       "<input  id='password-input' type='password' class='input-small form-control' placeholder='Password'>"
        ])

       (el :button {
                     :id       "signup-button"
                     :type     "button"
                     :class    "btn btn-primary"
                     :style    "margin-left: 10px;"
                     :text     "Sign up"
                     :onclick  #(do-action "signup user"
                                           {
                                            :username    (value-of "username-input")
                                            :password    (value-of "password-input")
                                            })})

       (el :button {
                     :type "button"
                     :class "btn btn-info"
                     :style "margin-left: 10px;"
                     :text "Cancel"
                     :onclick #(do-action "show login signup panel")})
      ]
  )
)









(defn-html logged-in-panel []
    (el :div {:class "row" :style "padding: 5px; width:400px;"} [
        (el :div
                          {:id    "signed-in-as-text"
                           :text  "Signing in..."
                           :class "pull-left"
                           :style "margin-right: 20px; margin-top:10px;"

         })

        (el :button
                          {:id    "logout-button"
                           :class "btn btn-default "
                           :text "Logout"
                           :style "margin-right: 20px;"
                           :onclick #(swap-section
                                                :#top-right
                                                (signup-panel-html))})

        (el :button
                          {:id    "settings-button"
                           :class "btn btn-default"
                           :text "Settings"
                           :style "margin-right: 20px;"
         })

]))








(redefine-action "show logged in panel"

    (do
      (clear "top-right")
      (add-to "top-right" (logged-in-panel))
    )
)

(redefine-action "update current user"
  (let [
        user message
        ]
         (swap-section "signed-in-as-text"
                       (str "<div>Signed in as " (:user_name user) "</div>"))
 ))






(defn-html login-signup-panel-html []

  (el :div {:class "pull-right"} [
        (el :button
                          {:id    "login-button"
                           :style "margin: 5px; "
                           :class "btn btn-default"
                           :text "login"
                           :onclick #(swap-section
                                                ($ :#top-right)
                                                (login-panel-html))
;                           :onmouseover #(show-popover "login-button"
;                                                       "Use this if you already have an account")
;                           :onmouseout #(hide-popovers)
                           })

        (el :button
                          {:id    "signup-button"
                           :style "margin: 5px;"
                           :class "btn btn-default"
                           :text "Sign up"
                           :onclick #(swap-section
                                                ($ :#top-right)
                                                (signup-panel-html))
                           })

        (el :button
                          {:id    "forgot-password-button"
                           :style "margin: 5px; "
                           :class "btn btn-default"
                           :text "Forgot password?"
                           :onclick #(swap-section
                                                ($ :#top-right)
                                                (forgot-password-panel-html))
                           })


              ])


)





(redefine-action  "show login signup panel"

    (swap-section "top-right" (login-signup-panel-html))
)






(redefine-action "signup user"
   (go
     (let [
             username             (:username message)
             password             (:password message)
             search-db-for-user   (<! (sql "SELECT * FROM users where user_name = ?"
                                  [username] ))
             user-already-exists  (pos? (count search-db-for-user))
          ]
             (cond
                  user-already-exists
                      (.log js/console "user already exists")

                  (= (count password) 0)
                      (show-popover "password-input"
                                       "Password cannot be empty"
                                       {:placement "bottom"})

                 :else
                       (do
                           (<! (sql "insert into users (user_name, password) values (?,?)"
                                     [username,password] ))
                           (.log js/console "Created user " username)
                           (do-action "show logged in panel")
                           (let [
                                 created-user (first (<! (sql "SELECT * FROM users where user_name = ?"
                                                    [username] )))]
                                    (.log js/console "Created user " created-user)
                                    (do-action "set logged in user" created-user)
                           )
                        )
              )
     )
  )
)









(redefine-action "login user"
   (go
     (let [
             username             (:username message)
             password             (:password message)
             search-db-for-user   (<! (sql "SELECT id, user_name, password
                                           FROM users where user_name = ?"
                                           [username] ))
             user-record-from-db  (first search-db-for-user)
          ]
             (if user-record-from-db
                 (do
                     (if (= password (:password user-record-from-db))
                         (do
                             (.log js/console (str "Logged in as user " user-record-from-db))
                             (do-action "show logged in panel")
                             (do-action "set logged in user" user-record-from-db)
                         )
                         (.log js/console "Password incorrect for user " username))
                 )

                 (show-popover "username-input"
                               "<br>User does not exist. Please check that the email is correct"
                               {:placement "left"})
              )
     )
  )
)




;(do-action "show login signup panel")
;(do-action "signup user" {:username "name22"})
;(do-action "show login panel")


