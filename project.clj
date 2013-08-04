(defproject org.clojars.zubairq2/webdb "0.4"
  :dependencies [
                   [org.clojure/clojure "1.5.1"]
                   [org.clojure/google-closure-library-third-party "0.0-2029"]
                   [domina "1.0.1"]
                   [crate "0.2.4"]
                   [prismatic/dommy "0.1.1"]
                   [korma "0.3.0-RC5"]
                   [org.postgresql/postgresql "9.2-1002-jdbc4"]
                   [compojure "1.1.5"]
                   [shoreleave "0.3.0"]
                   [shoreleave/shoreleave-remote-ring "0.3.0"]
                   [ring-middleware-format "0.3.0"]
                   [ring/ring-json "0.2.0"]
                   [jayq "2.4.0"]
                   [clojurewerkz/neocons "1.1.0"]
                   [facts/speech-synthesis "1.0.0"]
                   [facts/speech-recognition "1.0.0"]
                   [org.clojure/clojurescript "0.0-1820"]
                   [org.clojure/core.async "0.1.0-SNAPSHOT"]
                ]
  :repositories {"sonatype-oss-public" "https://oss.sonatype.org/content/groups/public/"}
  :url "http://org.clojars.zubair2/webdb"

  :plugins  [
               [lein-cljsbuild "0.3.0"]
               [lein-httpd "1.0.0"]
               [lein-ring "0.8.5"]
            ]

  :source-paths ["src"]

  :ring {:handler webapp.framework.server.core/app}

  :cljsbuild
  {
    :builds
     [
      {
         :source-paths ["src"]
         :compiler     {
                         :output-to      "resources/public/main.js"
                         :optimizations  :whitespace
                         :externs        ["resources/public/jquery-externs.js" "resources/public/google_maps_api_v3_3.js"]
                         :pretty-print   false
                       }
      }
     ]

  }
)
