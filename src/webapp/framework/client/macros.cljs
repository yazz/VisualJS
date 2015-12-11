(ns webapp.framework.client.macros

  ;(:require [webapp.framework.client.fns :refer [abcd-fn] ])
)


(defmacro div [attributes & more]
  `(om.dom/div  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))



(defmacro zoo [attr]
  attr)

