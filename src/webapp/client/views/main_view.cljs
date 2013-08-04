(ns webapp.client.main-view
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
    )
    (:require-macros
        [cljs.core.async.macros :refer [go alt!]])

    (:use
        [webapp.framework.client.coreclient :only [swap-section sql el clear addto remote  add-to]]
        [jayq.core                          :only [$ css  append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
        [webapp.framework.client.interpreter :only [!fn]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action]]
        [webapp.framework.client.coreclient :only [on-click on-mouseover]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)



(defn sidebar []
  "
    <div id='bs-sidebar' class='bs-sidebar affix'>
      <ul class='nav bs-sidenav'>

        <li  class='active'>
          <a href='#welcome'>Overview</a>
          <ul class='nav'>

            <li><a href='#ss2'>Events</a></li>
          </ul>
        </li>

        <li class=''><a href='#ss3'>Transitions</a></li>

        <li class=''>
          <a href='#ss5'>Modal</a>
          <ul class='nav'>
            <li><a href='#ss6'>Examples</a></li>
            <li><a href='#ss7'>Usage</a></li>
          </ul>
        </li>

        <li>
          <a href='#ss8'>Tab</a>
          <ul class='nav'>
            <li><a href='#ss9'>Examples</a></li>
            <li><a href='#ss10'>Usage</a></li>
          </ul>
        </li>

        <li>
          <a href='#details'>Affix</a>
          <ul class='nav'>
            <li><a href='#ss12'>Examples2</a></li>
            <li><a href='#ss13'>Usage2</a></li>
          </ul>
        </li>


      </ul>
    </div>
")






(defn homepage-html []

  (el
    :div {:id    "scrollable"
          :data-spy    "scroll"
            :data-offset "0"
          :data-target "#bs-sidebar"
          :style "overflow: auto; height: 300px;"}
     [

        (el :div {:id "welcome" :style "padding: 20px;"
                  :text "Welcome to Clojure on Coils."} )

        (el :div {:style "padding: 20px;"
                  :text "Clojure on Coils is a Clojure based webapp framework for single page database backed webapps"})

        (el :div {:style "padding: 20px;"
                  :text "Uses: Clojure, Clojurescript, JQuery, Bootstrap.js"})

       (el :div {:id "" :style "padding-bottom: 1000px;" })

      (el :div {:id "details" :style "padding: 20px;"
                  :text "Uses: Clojure, Clojurescript, JQuery, Bootstrap.js"})




        ;(el :div {:id "popup"})
     ]
  )
)








(define-action
    "refresh homepage"
    (do
      (do-action "clear homepage")
      (do-action "show homepage")
    )
)

(define-action
    "show home page"
    (do
        (-> ($ :#main-section)
            (fade-out 200
                      #(do
                         (-> ($ :#main-section)
                             (empty)
                             (append (homepage-html))
                             (fade-in)

                        )

                      )
             )
        )

      (swap-section
            ($ :#left-navigation)
            (sidebar)
           #(js/updateScrollSpy)
       )
        nil
     )
)

