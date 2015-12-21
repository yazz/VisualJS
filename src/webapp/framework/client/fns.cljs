(ns webapp.framework.client.fns  )

(defn cljs-in-cljs [] (om.dom/div {:style {:color "red"}} ""))


(defn main [data owner]
  (reify
    om.core/IRender
    (om.core/render [this]
      (om.dom/div nil ""))))
