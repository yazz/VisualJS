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
      :div {:id          "scrollable"
          :data-spy    "scroll"
          :data-target ".bs-docs-sidebar"}

      [
          (el :div {:style "padding: 20px;"
                  :text "Components"} )


           (el :button
                      {:id "show-esb-button"
                       :style "margin: 20px;"
                       :class "btn btn-large"
                       :text "ESB"
                       :onclick #(esb)})



        (el :button
                      {:id    "help-button"
                       :style "margin: 20px;"
                       :class "btn btn-large"
                       :text "Help"
                       :onclick #(help)})

        (el :button
                      {:id    "dissappear-button"
                       :style "margin: 20px;"
                       :class "btn btn-large"
                       :text "Dissappear"
                       :onclick  #(! clear)
                       })

        (el :button
                      {:id "show-esb-button"
                       :style "margin: 20px;"
                       :class "btn btn-large"
                       :text "ESB"
                       :onclick #(esb)})

        (el :div {:style "margin: 200px;" :id "top" :text "Some text"})
        (el :div {:style "margin: 200px;" :id "top2" :text "Some text"})
        (el :div {:style "margin: 200px;" :text "Some text"})
        (el :div {:style "margin: 200px;" :text "Some text"})
        (el :div {:style "margin: 200px;" :text "Some text"})
        (el :div {:style "margin: 200px;" :text "Some text"})
        (el :div {:style "margin: 200px;" :text "Some text"})
        (el :div {:style "margin: 200px;" :text "Some text"})
        (el :div {:style "margin: 200px;" :text "Some text"})
        (el :div {:style "margin: 200px;" :text "Some text"})
        (el :div {:style "margin: 200px;" :text "Some text"})

        (el :div {:style "margin: 20px;" :id "two" :text "two"})


      ]
  )
)


(defn sidebar [] "
<div class='bs-docs-sidebar'>
        <ul class='nav nav-list bs-docs-sidenav affix'>
          <li class='active'><a href='#top'><i class='icon-chevron-right'></i> Overview</a></li>
          <li><a href='#top2'><i class='icon-chevron-right'></i> Transitions</a></li>
          <li><a href='#modals'><i class='icon-chevron-right'></i> Modal</a></li>
          <li><a href='#dropdowns'><i class='icon-chevron-right'></i> Dropdown</a></li>
          <li class=''><a href='#scrollspy'><i class='icon-chevron-right'></i> Scrollspy</a></li>
          <li><a href='#tabs'><i class='icon-chevron-right'></i> Tab</a></li>
          <li><a href='#tooltips'><i class='icon-chevron-right'></i> Tooltip</a></li>
          <li><a href='#popovers'><i class='icon-chevron-right'></i> Popover</a></li>
          <li><a href='#alerts'><i class='icon-chevron-right'></i> Alert</a></li>
          <li><a href='#buttons'><i class='icon-chevron-right'></i> Button</a></li>
          <li><a href='#collapse'><i class='icon-chevron-right'></i> Collapse</a></li>
          <li><a href='#carousel'><i class='icon-chevron-right'></i> Carousel</a></li>
          <li><a href='#typeahead'><i class='icon-chevron-right'></i> Typeahead</a></li>
          <li><a href='#two'><i class='icon-chevron-right'></i> Affix</a></li>
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
        )
    )
)
;(do-action "show docs page")