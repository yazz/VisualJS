(ns webapp.client.topnav
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
        [cljs.core.async :as async :refer [chan close!]]
    )
    (:use
        [webapp.framework.client.coreclient :only [show-popover debug-mode sql-fn header-text body-text body-html make-sidebar  swap-section  el clear addto remote  add-to]]
        [jayq.core                          :only [$ css append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
        [domina                             :only [ by-id value destroy! ]]
  )
  (:require-macros
    [cljs.core.async.macros :refer [go alt!]])
  (:use-macros
        [webapp.framework.client.eventbus :only [redefine-action define-action]]
        [webapp.framework.client.coreclient :only [makeit ns-coils defn-html on-click on-mouseover sql]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)
(ns-coils webapp.client.topnav)



(defn-html top-nav-bar []
        "<a id=logo class=navbar-brand href='#' onclick='webapp.client.topnav.toggledebug();'>Companator</a>
                <ul class='nav navbar-nav'>
                  <li id='home-button' class=active><a href='#'>Home</a></li>
                  <li id='docs-button'><a href='#'>Docs</a></li>
                  <li id='case-studies-button'><a href='#'>Case studies</a></li>
                  <li id='example-apps-button'><a href='#'>Examples</a></li>
                  <li id='contact-button'><a href='#'>Contact</a></li>
                </ul>")


(go
     (let [server-debug-mode  (<! (remote "get-show-debug"))]
        (cond
                (nil? server-debug-mode)
                   (reset! debug-mode {:value false})
                (= (get server-debug-mode :value) {:value true})
                   (reset! debug-mode true)
                :else
                     (reset! debug-mode {:value false})
        )
     )
    (.log js/console (str (get @debug-mode :value)))
)

(defn ^:export toggledebug [
                             ]
    (cond
     (= @debug-mode nil)
     (reset! debug-mode {:value true})

     (= (:value @debug-mode) true)
     (reset! debug-mode {:value false})

     :else
     (reset! debug-mode {:value true})
     )
    (let [dv (str "Debug: " (get @debug-mode :value)) ]
      (do
          (show-popover "logo" dv {:placement "right"})
          (.log js/console dv)
        )
      )

)

;show-popover

(defn remove-nav-active []
  (. ($ :#home-button) removeClass "active")
  (. ($ :#contact-button) removeClass "active")
  (. ($ :#case-studies-button) removeClass "active")
  (. ($ :#example-apps-button) removeClass "active")
  (. ($ :#docs-button) removeClass "active"))






(defn add-nav-listeners []

    (on-click
              "home-button"

              (remove-nav-active)
              (. ($ :#home-button) addClass "active")
              (do-action "show home page")
     )


    (on-click
              "docs-button"

              (remove-nav-active)
              (. ($ :#docs-button) addClass "active")
              (do-action "show docs page")
     )


    (on-click
              "case-studies-button"

              (remove-nav-active)
              (. ($ :#case-studies-button) addClass "active")
              (do-action "show case studies view")
     )

    (on-click
              "example-apps-button"

              (remove-nav-active)
              (. ($ :#example-apps-button) addClass "active")
              (do-action "show example apps view")
     )


    (on-click
              "contact-button"

              (remove-nav-active)
              (. ($ :#contact-button) addClass "active")
              (do-action "show who page")
     )
)







(redefine-action
    "show top nav"
    (do
        (clear "top-left")
        (add-to "top-left" (top-nav-bar))
        (add-nav-listeners)

        (do-action "deal with session stuff")
))

;(do-action "show top nav")
