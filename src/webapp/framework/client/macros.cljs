(ns webapp.framework.client.macros

  ;(:require [webapp.framework.client.fns :refer [abcd-fn] ])
)



(defmacro input [attributes & more]
  `(om.dom/input  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))


(defmacro button [attributes & more]
  `(om.dom/button  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))


(defmacro div [attributes & more]
  `(om.dom/div  (webapp.framework.client.coreclient/attrs ~attributes) ~@more))




(defmacro zoo [attr]
  attr)


