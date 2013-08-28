(ns webapp.framework.server.encrypt
  [:import [org.jasypt.util.text.BasicTextEncryptor]]
  [:use [webapp-config.settings]]
)




(defonce encryptor
    (let [
          textEncryptor (org.jasypt.util.text.BasicTextEncryptor.)
         ]

          ;(. textEncryptor setPassword (str (java.util.UUID/randomUUID) ))
          (. textEncryptor setPassword *sql-encryption-password*  )
          textEncryptor)
)


(defn encrypt [text]
  (let [l (. encryptor encrypt text)]
      l
    )

  )

(defn decrypt [text]
  (. encryptor decrypt text)
)



;(encrypt "select * from test_tables")
;(decrypt "mpEMiEFGidt78gBj+AdWbOMuXnnuMQyRusERMUTescip0enVLFt2VQ==")
;(decrypt "EAhL/YJxdzchZOntlXoX7h9T/QUbKexpAg8VjkoIxjiNIH+o5x+hKBOOUL9OtHaB")