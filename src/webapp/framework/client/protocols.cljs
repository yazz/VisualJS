(ns webapp.framework.client.protocols)



(defrecord Html [])
(defrecord Tree [])



(defprotocol TypeInfo
  (gettype [this] nil)
)


(extend-type Html
  TypeInfo
  (gettype [this]  "Html")

)

(extend-type Tree
  TypeInfo
  (gettype [this]  "Tree")

)

(def a (Html.))


(gettype a)

(def b (Tree.))


(gettype b)