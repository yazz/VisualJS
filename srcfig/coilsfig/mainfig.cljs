(ns coilsfig.mainfig
  (:require    [figwheel.client :as fw])
  (:use        [webapp.framework.client.system-globals  :only  [touch]]))


(fw/start { :on-jsload (fn []
                         (touch [:ui])
                         )})
