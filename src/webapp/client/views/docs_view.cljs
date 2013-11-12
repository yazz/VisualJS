(ns webapp.client.docs-view
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
        [cljs.core.async :as async :refer [chan close!]]
        ;[google.maps]
        ;[google.maps.MapTypeId]
    )

  (:require-macros
    [cljs.core.async.macros :refer [go alt!]])

  (:use
        [webapp.framework.client.coreclient :only [popup do-before-remove-element new-dom-id find-el clj-to-js sql-fn header-text body-text body-html make-sidebar  swap-section  el clear addto remote  add-to]]
        [jayq.core                          :only [attr $ css append fade-out fade-in empty]]
        [webapp.framework.client.help       :only [help]]
        [webapp.framework.client.eventbus   :only [do-action esb undefine-action]]
        [webapp.framework.client.interpreter :only [!fn]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action redefine-action]]
        [webapp.framework.client.coreclient :only [makeit ns-coils defn-html on-click on-mouseover sql]]
        [webapp.framework.client.interpreter :only [! !! !!!]]
     )
)
(ns-coils 'webapp.client.docs-view)





(defn-html docspage-html []

  (el
      :div {:id    "scrollable"
            :data-spy    "scroll"
            :data-offset "0"
            :data-target "#bs-sidebar"
            :style "overflow: auto; "}

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
                           :text "3d"
                           :onclick #(do-action "show 3d debugger")})

          (el :button
                          {:id    "dissappear-button"
                           :style "margin: 20px;"
                           :class "btn btn-large btn-default"
                           :text "Dissappear"
                           :onclick  #(! clear)
                           })

          (el :button
                          {:id "show-speech-button"
                           :style "margin: 20px;"
                           :class "btn btn-large btn-default"
                           :text "Speech"
                           :onclick #(add-to "main-section"
                                     "<form method='get' action='http://www.google.com/search'>
                                         <input type='text' name='q' size='30' x-webkit-speech/>
                                         <input type='submit' value='Google Search' />
                                        </form>
                                     ")})


          (el :button
                          {:id    "another-button"
                           :style "margin: 20px;"
                           :class "btn btn-large btn-default"
                           :text "Another"
                           :onclick  (fn [](go (js/alert (str (<! (remote "get-environment"))))))
                           })




          (el :button
                          {:id    "show-map-button"
                           :style "margin: 20px;"
                           :class "btn btn-large btn-default"
                           :text  "Map"
                           :onclick  #(do-action "show map")
                           })



      ]
  )
)







(defn-html installing-html []
    (el :div {} [
        (header-text "Installing the development tools" )
        (body-html "<div>To install Clojure on Coils you need to install the following:
                   <br><br>

                   <a href='http://www.oracle.com/technetwork/java/javase/downloads/index.html'>JDK SE 1.7</a>
                   <br>
                   <a href='http://www.lighttable.com/'>LightTable</a>
                   <br>
                   <a href='http://leiningen.org/'>Leiningen</a>
                   <br>
                   <a href='http://git-scm.com/'>GIT</a>
                   <br>
                   <a href='http://www.neo4j.org/'>Neo4j</a>
                   <br>
                   <a href='http://www.postgresql.org'>Postgres (optional)</a>
                   </div>")



]))









(defn-html installing-2-html []
    (el :div {} [
        (header-text "Installing Clojure on Coils" )
        (body-html "<div>Go to a command line and type:
                   <br><br><pre style='text-align: left;'>
                   <br>
                   git clone https://github.com/zubairq/coils.git
                   <br>
                   cd coils
                   <br>
                   lein with-profile dev cljsbuild clean
                   <br>
                   lein with-profile dev cljsbuild auto
                   <br>
                   lein with-profile dev ring server
                   <br>
                   </pre>
                   : then go to <b>http://127.0.0.1:3000/main.html</b> to see the base application running
                   </div>")
]))





(defn hide-map []
   (add-to "main" "map-canvas")

   (css
       ($ (find-el "map-canvas"))
        {:visibility "hidden"}
   )

   (css
       ($ (find-el "map-canvas"))
       {:display "none"}
   )
)




(defmethod do-before-remove-element
    "map-content"
    [elem]
        (.log js/console (str "Hiding map '" (attr ($ (find-el elem)) "id") "'") )
        (hide-map)
  )


(defn-html sidebar []
  (el :div {} [
    (make-sidebar
         {:text "Installation 1" :html (installing-html)}
         {:text "Installation 2" :html (installing-2-html)}
         {:text "Examples" :html (docspage-html)}
     )


               ])
)






(redefine-action
    "show docs page"
    (do
        (swap-section
            ($ :#main-section)
            (installing-html)
        )
        (swap-section
            ($ :#left-navigation)
            (sidebar)

        )

    )
)

(redefine-action
 "show alert"
 (do
   (.log js/console message)
   ))

(defn-html map-html [map-id]
    (el :div {:id "map-content" :data-role "content"
              :style "position: absolute;
                      width: 100% !important;
                      height: 100% !important;
                      padding: 0 !important;
                      top : 0px !important;
                      bottom : 0px !important;
                      right : 0px !important;
                      left : 0px !important;"
              :target "_blank"} [



]))



(def the-map (atom nil))

(redefine-action
 "show map"
   (let [map-id   "map-canvas"]
       (clear :#main-section)
       (swap-section
            ($ :#main-section)
            (map-html map-id)
            #(let [
                map-options  {
                                 :zoom 8
                                 :center (google.maps.LatLng. -34.397, 150.644)
                                 :mapTypeId google.maps.MapTypeId.ROADMAP
                             }
               ]
               (do
                 (if @the-map
                   (do
                        (add-to "map-content" "map-canvas")

                         (css
                             ($ (find-el "map-canvas"))
                              {:visibility ""}
                         )

                         (css
                             ($ (find-el "map-canvas"))
                             {:display ""}
                         )
                   )

                   (do

                        (add-to
                         "map-content"
                         (el :div {:id map-id
                                  :style "width: 100% !important;
                                          height: 100% !important;
                                          "
                                  :target "_blank"} [

                          ]))

                         (reset! the-map (google.maps.Map.

                                     (. js/document getElementById map-id)
                                     (clj-to-js  map-options)))
                   )
                 )

                 ;(google.maps.event/trigger   map-id  "resize")

                 map-options))
            )
     []



))

;(hide-map)

;(do-action "show map")


;(do-action "show docs page")
