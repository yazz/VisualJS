(ns webapp.framework.server.encrypt
  [:import [org.jasypt.util.text.BasicTextEncryptor]]
  [:use [webapp-config.settings]]
)




(defonce encryptor
    (let [
          textEncryptor (org.jasypt.util.text.BasicTextEncryptor.)
         ]

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

