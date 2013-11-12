(ns webapp.client.session
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
        [cljs.core.async :as async :refer [chan close!]]
    )
    (:use
        [webapp.framework.client.coreclient :only [popup hide-popovers show-popover set-text value-of find-el sql-fn swap-section sql el clear addto remote  add-to on-mouseover-fn on-click-fn]]
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








(def current-user (atom nil))

;@current-user

(define-action "set logged in user"
  (let
    [
       user       (:user        message)
       session-id (:session-id  message)
     ]
       (reset! current-user user)
       (.log js/console (str "Current user:" @current-user))
       (do-action "update current user" @current-user)
       (.log js/console (str "Done" ))
       (.set goog.net.cookies "coils.cc" (str session-id) -1)

  )
)
