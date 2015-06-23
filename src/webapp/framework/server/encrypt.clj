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


;(. "abc" replaceAll "a" "ff")

(defn encrypt [text]
  (let [
        l   (. encryptor encrypt text)
        ;l2  (. l replaceAll "/" "_")
        ;l3  (. l2 replaceAll "\\+" "-")
        ]
    (do
      ;(println (str "MAKE pass: " *sql-encryption-password* " -> " l))
      ;text
      l)))


;(decrypt (encrypt "hey dude"))

(defn decrypt [text]
    (let [
          ;o  (println "unencrypt pass: " text " -> " *sql-encryption-password* )
          l   (. encryptor decrypt text)
          ;l2  (. l  replaceAll "_" "/")
          ;l3  (. l2 replaceAll "-" "\\+")
          ]
          ;(println "unencrypted:  -> " l )

      l
      ;text
      )
)

