(ns webapp.client.page-structure
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
    )
    (:use
        [webapp.framework.client.coreclient :only [sql el clear addto remote  add-to]]
        [jayq.core                          :only [$ css  append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
        [webapp.framework.client.interpreter :only [!fn]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [redefine-action]]
        [webapp.framework.client.coreclient :only [makeit ns-coils on-click on-mouseover]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)
(ns-coils 'webapp.client.page-structure)


(defn top-structure-html []

  (el :div {:style "position:absolute; top:0px; left:0px; height:50px; right:0px;overflow:hidden;"
            :id    "top-section"}
      [
       "<div>
          <div class='navbar'>
            <div id='top-left'>
            </div>

            <div  id='top-right' class='pull-right'>
            </div>
          </div>
        </div>"
       ]
      )
  )








(defn middle-structure-html []

      (el :div {:class "row" :style "margin:0px; width:100%; position:absolute; top:50px; bottom:50px;  overflow:auto;"} [
        (el :div {:class "col-sm-3 col-xs-12 "
                  :style " "
                  :id "left-navigation" } )

        (el :div {:class "col-lg-9" :style "margin-left:140px; top:50px; bottom:50px; right:0px; overflow:auto; height:100%;"
                  :id "main-section"} )
                   ])
)






(defn bottom-structure-html []


      (el :div {:style "border: 1px solid lightgray; position:absolute; bottom:0px; height:50px; left:0px; right:0px; overflow:hidden;"
                  :id "bottom-section"} )

)






(redefine-action
    "create blank page structure"
    (-> ($ :#main)
          (empty)
          (append (top-structure-html))
          (append (middle-structure-html))
          (append (bottom-structure-html))
    )
)

;(do-action "create blank page structure")
