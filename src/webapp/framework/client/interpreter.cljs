(ns webapp.framework.client.interpreter)


(defn !fn [x]
  (cond
     (= (:type (first x)) "class clojure.lang.Symbol")
          (apply
             (:value (first x))
             (into [] (map :value (rest x)))
          )
     :else
         "Command not understood"
   )
)


(!fn [{:value str} {:value 22} {:value "dd"} {:value "dd"}])


(!fn [{:value +} {:value 22} {:value 2} {:value 1}])

(str)
