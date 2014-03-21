(ns webapp.framework.client.protocols
  (:use
   [webapp.framework.client.records :only  [Html Tree NeoNode]]
   )
  )



(defprotocol INeoNode
  (id [this] :id)
)



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


