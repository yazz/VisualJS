(ns webapp.client.components.usermain
  (:require
   [om.core          :as om :include-macros true]
   [om.dom           :as dom :include-macros true]
   )

  (:use
   [webapp.client.components.forms              :only   [request-form]]
   [webapp.client.views.main                    :only   [main-view]]
   ))




(defn ^:export main [app owner]
  (om/build  main-view  app))
