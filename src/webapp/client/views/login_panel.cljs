(ns webapp.client.login-panel
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
        [cljs.core.async :as async :refer [chan close!]]
    )
    (:use
        [webapp.framework.client.coreclient :only [value-of find-el sql-fn swap-section sql el clear addto remote  add-to on-mouseover-fn on-click-fn]]
        [jayq.core                          :only [$ css  append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
        [domina                             :only [ by-id value destroy! ]]
  )
  (:require-macros
    [cljs.core.async.macros :refer [go alt!]])
  (:use-macros
        [webapp.framework.client.eventbus :only [redefine-action define-action]]
        [webapp.framework.client.coreclient :only [on-click on-mouseover sql]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)







(defn login-panel []
  (el :form {:class "form-inline" :style "padding: 5px"}
      [
        "<input  id='username-input' type='text' class='input-small' placeholder='Email'>"

        "<input  id='password-button' type='password' class='input-small' placeholder='Password'>"

        "<label class='checkbox' style='margin-right:15px;margin-left:10px;'>
          <input type='checkbox'> Remember me
        </label>"

        "<button id='login-button' type='button' class='btn btn-primary' onclick='return false;
                 style='margin-left: 10px;'>Login</button>"

        (el :button {
                     :type "button"
                     :class "btn btn-info"
                     :style "margin-left: 10px;"
                     :text "Cancel"
                     :onclick #(do-action "show login panel")})

      ]
  )
)





(defn signup-panel []
  (el :form {:class "form-inline" :style "padding: 5px"}
      [

       "<input  id='username-input' type='text' class='input-small' placeholder='Email'>"

       "<input  id='password-button' type='password' class='input-small' placeholder='Password'>"

       (el :button {
                     :id   "signup-button"
                     :type "button"
                     :class "btn btn-primary"
                     :style "margin-left: 10px;"
                     :text "Sign up"
                     :onclick
                        #(do-action "signup user"
                                    {:username (value-of "username-input")})
                    })

       (el :button {
                     :type "button"
                     :class "btn btn-info"
                     :style "margin-left: 10px;"
                     :text "Cancel"
                     :onclick #(do-action "show login panel")})
      ]
  )
)






(defn login-signup-panel []
    (el :div {} [
        (el :button
                          {:id    "login-button"
                           :style "margin: 5px; "
                           :class "btn btn-default"
                           :text "login"
                           :onclick #(swap-section
                                                ($ :#top-right)
                                                (login-panel))})

        (el :button
                          {:id    "signup-button"
                           :style "margin: 5px;"
                           :class "btn btn-default"
                           :text "Sign up"
                           :onclick #(swap-section
                                                ($ :#top-right)
                                                (signup-panel))})
              ])
  )









(redefine-action
    "show login panel"

    (do
      (clear "top-right")
      (add-to "top-right" (login-signup-panel))
))






(redefine-action "signup user"
   (go
     (let [
             username             (:username message)
             search-db-for-user   (<! (sql "SELECT * FROM users where user_name = ?" [username] ))
             user-already-exists  (pos? (count search-db-for-user))
          ]
             (if user-already-exists
                 (.log js/console "user already exists")
                 (do
                     (.log js/console
                          (str (<! (sql "insert into users (user_name, password) values (?,?)"
                            [username,""] )))
                           )
                   (.log js/console "Created user " username))
              )
     )
  )
)







(do-action "signup user" {:username "name22"})
;(do-action "show login panel")


