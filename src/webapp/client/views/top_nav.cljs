(ns webapp.client.top-nav
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
        [cljs.core.async :as async :refer [chan close!]]
    )
    (:use
        [webapp.framework.client.coreclient :only [sql el clear addto remote  add-to on-mouseover-fn on-click-fn]]
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





(defn top-nav-bar []
        "<div>
           <div class=navbar>
                <a class=navbar-brand href='#'>Coils.cc</a>
                <ul class='nav navbar-nav'>
                  <li id='home-button' class=active><a href='#'>Home</a></li>
                  <li id='docs-button'><a href='#'>Docs</a></li>
                  <li id='case-studies-button'><a href='#'>Case studies</a></li>
                  <li id='contact-button'><a href='#'>Contact</a></li>
                </ul>

              <div class=pull-right>
                  <form class='form-inline' style='padding: 5px;'>
                      <input  id='username-input' type='text' class='input-small' placeholder='Email'>
                      <input  id='password-button' type='password' class='input-small' placeholder='Password'>
                      <label class='checkbox'>
                        <input type='checkbox'> Remember me
                      </label>
                      <button id='login-button' type='submit' class='btn' onclick='return false;'>Sign in</button>
                  </form>
              </div>
            </div>


         </div>"
  )


(defn remove-nav-active []
  (. ($ :#home-button) removeClass "active")
  (. ($ :#contact-button) removeClass "active")
  (. ($ :#case-studies-button) removeClass "active")
  (. ($ :#docs-button) removeClass "active")

)

(defn add-nav-listeners []

    (on-mouseover
              "home-button"

              (remove-nav-active)
              (. ($ :#home-button) addClass "active")
              (do-action "show home page")
     )


    (on-mouseover
              "docs-button"

              (remove-nav-active)
              (. ($ :#docs-button) addClass "active")
              (do-action "show docs page")
     )


    (on-mouseover
              "case-studies-button"

              (remove-nav-active)
              (. ($ :#case-studies-button) addClass "active")
              (do-action "show case studies view")
     )



    (on-mouseover
              "contact-button"

              (remove-nav-active)
              (. ($ :#contact-button) addClass "active")
              (do-action "show who page")
     )

     (on-click
              "login-button"

                (go
                     (js/alert
                         (str (<! (remote "get-from-neo" {:name "gfdgf"})))))
      )


)
(comment go
     (js/alert
         (str (<! (remote "say-hello" {:name "Johnny"})))))

(comment go
     (js/alert
         (str (<! (remote "get-from-neo" {:name "gfdgf"})))))

(redefine-action
    "show top nav"
    (do
        (clear "top-section")
        (add-to "top-section" (top-nav-bar))
        (add-nav-listeners)

))

;(do-action "show top nav")
