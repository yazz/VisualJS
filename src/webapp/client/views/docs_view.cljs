(ns webapp.client.docs-view
    (:refer-clojure :exclude [val empty remove find next parents])
    (:require
        [cljs.reader :as reader]
        [crate.core :as crate]
        [cljs.core.async :as async :refer [chan close!]]
  )
  (:require-macros
    [cljs.core.async.macros :refer [go alt!]])

    (:use
        [webapp.framework.client.coreclient :only [header-text body-text body-html make-sidebar  swap-section sql el clear addto remote  add-to]]
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
                           :onclick  (fn [](go (js/alert (str (<! (remote "say-hello" {:name "1"}))))))
                           })



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


(defn installing-html []
    (el :div {} [
        (header-text "Installing the development tools" )
        (body-html "<div>To install Clojure on Coils you need to install the following:
                   <br><br>
                   <a href='http://www.oracle.com/technetwork/java/javase/downloads/index.html'>JDK SE 1.7</a>
                   <br>
                   <a href='http://www.lighttable.com/'>LightTable</a>
                   <br>
                   <a href='http://leiningen.org/'>Leiningen</a>
                   </div>
                   <a href='http://git-scm.com/'>GIT</a>
                   </div>")



]))


(defn installing-2-html []
    (el :div {} [
        (header-text "Installing Clojure on Coils" )
        (body-html "<div>Go to a command line and type:
                   <br><br><pre style='text-align: left;'>
                   <br>
                   git clone https://github.com/zubairq/coils.git
                   <br>
                   cd coils
                   <br>
                   lein ring server
                   <br>
                   </pre>
                   : then go to <b>http://127.0.0.1:3000/main.html</b> to see the base application running
                   </div>")
]))

(defn sidebar []
  (make-sidebar
       {:text "Installation 1" :html (installing-html)}
       {:text "Installation 2" :html (installing-2-html)}
       {:text "Examples" :html (docspage-html)}
   )
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
;      #(js/updateScrollSpy)

    )
)



;(do-action "show docs page")