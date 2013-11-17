(ns webapp.framework.client.interpreter)


;(str (symbol 'sd))

(defmacro ! [ & command-content ]
    (list 'webapp.framework.client.interpreter/!fn (into []
      (apply list
        (map
            (fn [this-part]
                {
                    :type     (str (type this-part))
                    :value    (if (not (fn? this-part)) this-part)
                    :symbol   (if (fn? this-part) this-part)
                    :str      (str this-part)
                }
            )
            command-content
        )
      )
    ))
)


(defmacro !! [ & command-content ]
    (into []
      (apply list
        (map
            (fn [this-part]
                {
                    :type     (str (type this-part))
                    :value    (if (not (fn? this-part)) this-part)
                    :symbol   (if (fn? this-part) this-part)
                    :str      (str this-part)                }
            )
            command-content
        )
      )
    )
)

(defmacro !!! [ & command-content ]
    (str (into []
      (apply list
        (map
            (fn [this-part]
                {
                    :type     (str (type this-part))
                    :value    (if (not (fn? this-part)) this-part)
                    :symbol   (if (fn? this-part) this-part)
                    :str      (str this-part)                }
            )
            command-content
        )
      )
    ))
)

;(macroexpand '(! "sad" "sad"))

;(macroexpand '(!!! str 1))
