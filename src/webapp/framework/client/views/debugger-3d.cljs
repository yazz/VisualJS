(ns webapp.framework.client.debugger-3d
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
        [webapp.framework.client.coreclient :only [width height popup do-before-remove-element new-dom-id find-el clj-to-js sql-fn header-text body-text body-html make-sidebar  swap-section  el clear addto remote  add-to]]
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
(ns-coils 'webapp.framework.client.debugger-3d)



(defn show-3d []
  (clear "main-section")
  (let [scene        (js/THREE.Scene.)
        width        (width "main-section")
        height       (height "main-section")
        camera       (js/THREE.PerspectiveCamera. 75 (/ width height) 0.1 1000 )
        renderer (js/THREE.CanvasRenderer.)
        geometry (js/THREE.CubeGeometry. 1 1 1)
        material (js/THREE.MeshBasicMaterial. (clj->js {:color 0x00ff00}))
        cube (js/THREE.Mesh. geometry material)
        render (fn cb []
                   (js/requestAnimationFrame cb)
                   (set! (.-x (.-rotation cube))  (+ 0.1 (.-x (.-rotation cube))) )
                   (set! (.-y (.-rotation cube))  (+ 0.1 (.-y (.-rotation cube))) )
                   (.render renderer scene camera)
                 )
        ]
    (.setSize renderer width height)
    (add-to "main-section" (.-domElement renderer) )
    (.add scene cube)
    (set! (.-z (.-position camera))  5)
    (render)
    )

)


(-> ($ (find-el "main-section") ) (. height))

;(show-3d)

(redefine-action "show 3d debugger"
  (show-3d)
)
