(ns webapp.client.login-panel
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
        [cljs.core.async :as async :refer [chan close!]]
    )
    (:use
        [webapp.framework.client.coreclient :only [swap-section sql el clear addto remote  add-to on-mouseover-fn on-click-fn]]
        [jayq.core                          :only [$ css  append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
        [domina                             :only [ by-id value destroy! ]]
  )
  (:require-macros
    [cljs.core.async.macros :refer [go alt!]])
  (:use-macros
        [webapp.framework.client.eventbus :only [redefine-action define-action]]
        [webapp.framework.client.coreclient :only [on-click on-mouseover]]
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

        "<button id='login-button' type='button' class='btn' onclick='return false;
                 style='margin-left: 10px;'>Login</button>"

        (el :button {
                     :type "button"
                     :class "btn"
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

       "<button id='login-button' type='button' class='btn' onclick='return false;'
                style='margin-left: 10px;'>Sign up</button>"

       (el :button {
                     :type "button"
                     :class "btn"
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
                           :class "btn"
                           :text "login"
                           :onclick #(swap-section
                                                ($ :#top-right)
                                                (login-panel))})

        (el :button
                          {:id    "signup-button"
                           :style "margin: 5px;"
                           :class "btn"
                           :text "Sign up"
                           :onclick #(swap-section
                                                ($ :#top-right)
                                                (signup-panel))})
              ])
  )




(defn add-login-listeners []
    (on-click
              "login-button"

                (go
                     (js/alert
                         (str (<! (remote "get-from-neo" {:name "gfdgf"})))))
      )


)

(comment go
     (js/alert
         (str (<! (remote "get-from-neo" {:name "gfdgf"})))))

(redefine-action
    "show login panel"

    (do
      (clear "top-right")
      (add-to "top-right" (login-signup-panel))
))

(do-action "show login panel")

