(ns webapp.client.docs-view
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
    )
    (:use
        [webapp.framework.client.coreclient :only [swap-section sql el clear addto remote  add-to]]
        [jayq.core                          :only [$ css  append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
        [webapp.framework.client.interpreter :only [!fn]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action redefine-action]]
        [webapp.framework.client.coreclient :only [on-click on-mouseover]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)


(defn docspage-html []

  (el
      :div {:id    "scrollable"
          :data-spy    "scroll"
            :data-offset "0"
          :data-target "#bs-sidebar"
            :style "overflow: auto; height: 200px;"}

      [
          (el :div {:style "padding: 20px;"
                  :text "Components"} )


          (el :button
                      {:id "show-esb-button"
                       :style "margin: 20px;"
                       :class "btn btn-large btn-default"
                       :text "ESB"
                       :onclick #(esb)})



          (el :button
                          {:id    "help-button"
                           :style "margin: 20px;"
                           :class "btn btn-large btn-default"
                           :text "Help"
                           :onclick #(help)})

          (el :button
                          {:id    "dissappear-button"
                           :style "margin: 20px;"
                           :class "btn btn-large btn-default"
                           :text "Dissappear"
                           :onclick  #(! clear)
                           })

          (el :button
                          {:id "show-esb-button"
                           :style "margin: 20px;"
                           :class "btn btn-large btn-default"
                           :text "ESB"
                           :onclick #(esb)})

        (el :div {:style "margin: 200px;" :id "ss1" :text "Some text1"})
        (el :div {:style "margin: 200px;" :id "ss2" :text "Some text2"})
        (el :div {:style "margin: 200px;" :id "ss3" :text "Some text3"})
        (el :div {:style "margin: 200px;" :id "ss4" :text "Some text4"})
        (el :div {:style "margin: 200px;" :id "ss5" :text "Some text5"})
        (el :div {:style "margin: 200px;" :id "ss6" :text "Some text6"})
        (el :div {:style "margin: 200px;" :id "ss7" :text "Some text7"})
        (el :div {:style "margin: 200px;" :id "ss8" :text "Some text8"})
        (el :div {:style "margin: 200px;" :id "ss9" :text "Some text9"})
        (el :div {:style "margin: 200px;" :id "ss10" :text "Some text10"})
        (el :div {:style "margin: 200px;" :id "ss11" :text "Some text11"})


      ]
  )
)


(defn sidebar []
  "
    <div id='bs-sidebar' class='bs-sidebar affix'>
      <ul class='nav bs-sidenav'>

        <li  class='active'>
          <a href='#ss1'>Overview</a>
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
          <a href='#ss11'>Affix</a>
          <ul class='nav'>
            <li><a href='#ss12'>Examples2</a></li>
            <li><a href='#ss13'>Usage2</a></li>
          </ul>
        </li>


      </ul>
    </div>
")




(redefine-action
    "show docs page"
    (do
        (swap-section
            ($ :#main-section)
            (docspage-html)
        )
        (swap-section
            ($ :#left-navigation)
            (sidebar)
            #(js/updateScrollSpy)
        )

    )
)

(js/updateScrollSpy)
;(do-action "show docs page")