(ns coilsfig.mainfig
  (:require    [figwheel.client :as fw])
  (:use        [webapp.framework.client.system-globals  :only  [touch]])
  (:use-macros [webapp.framework.client.coreclient  :only [use-figwheel]])
  )


(.log js/console (str "(use-figwheel): " (use-figwheel)))
(if (use-figwheel)
  (fw/start { :on-jsload (fn []
                           (touch [:ui])
                           )}))
