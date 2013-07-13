(ns webapp.framework.client.interpreter
    (:use
        [webapp.framework.client.eventbus  :only [do-action esb undefine-action]]
    )
    (:use-macros
        [webapp.framework.client.eventbus :only [define-action]]
    )
)


(defn item-is-symbol [item]
    (= (:type item) "class clojure.lang.Symbol")
)

(not (nil? +))

(defn !fn [symbol-list]
  (let
  [
      first-item      (first symbol-list)
      ]
      (cond

         (and
             (item-is-symbol first-item)
             (not (fn? (:symbol first-item)))
             )
               (cond
                   (= (:str first-item) "hi") "hi Zubair"
                   (= (:str first-item) "clear") (do-action "clear homepage")
                   :else (str "Unknown command " (:str first-item))
               )





         (item-is-symbol first-item)
             (apply
                 (:symbol first-item)
                 (into [] (map :value (rest symbol-list))))



         :else
             "Command not understood"
       )
  )
)


(!fn [{:value str} {:value 22} {:value "dd"} {:value "dd"}])


(!fn [{:value +} {:value 22} {:value 2} {:value 1}])

(str)
