(defproject org.clojars.zubairq/coils "0.7.5-beta"
  :dependencies [
                 [org.clojure/clojure "1.7.0"]
                 [org.clojure/clojurescript "1.7.122" :scope "provided"]
                 [org.omcljs/om "0.9.0"]
                 [org.clojure/core.async "0.2.374" :scope "provided"]
                 [cljsjs/react "0.13.3-0"]

                 [korma "0.4.2"]

                 [org.postgresql/postgresql "9.2-1002-jdbc4"]
                 [org.clojars.gukjoon/ojdbc "1.4"]
                 ; [com.oracle/ojdbc "12.1.0.2"]

                 [compojure "1.3.3"]
                 [ring "1.3.2"]
                 [ring-middleware-format "0.5.0"]
                 [rewrite-clj "0.2.0"]
                 [org.jasypt/jasypt "1.9.2"]
                 [clj-http "1.1.1"]
                 [cheshire "5.4.0"]
                 [ankha "0.1.4"]
                 [overtone/at-at "1.2.0"]
                 [org.clojure/tools.nrepl "0.2.11"]
                 [lein-figwheel "0.4.1"]
                 [instaparse "1.4.1"]
                 ]
  :repositories {"sonatype-oss-public"
                 "https://oss.sonatype.org/content/groups/public/"}

  :url "http://org.clojars.zubair/coils"

  :jvm-opts ["-Xmx4g"]

  :plugins  [
             [lein-cljsbuild "1.1.1"]
             [lein-httpd "1.0.0"]
             [lein-ring "0.9.7"]
             [lein-figwheel "0.4.1"]
             ]

  :profiles {
             :dev
             {
              :figwheel {
                         :http-server-root "public" ;; this will be in resources/
                         :ring-handler    webapp.framework.server.core/app
                         :css-dirs ["resources/public"]
                         }

              :source-paths ["src" "../srcdev"]
              :cljsbuild
              {
               :builds
               [
                {
                 :source-paths ["src" "../srcdev"]
                 :compiler     {
                                :preamble       ["public/react.min.js"]
                                :output-to      "resources/public/main.js"
                                :output-dir     "resources/public/out/"
                                :optimizations  :none
                                ;:output-wrapper false
                                ;:externs        ["resources/public/google_maps_api_v3_11.js"]
                                ;:pretty-print   false
                                :cache-analysis true
                                :source-map-timestamp true
                                :source-map true
                                }
                 }
                ]

               }
              }

             :base
             {
              :figwheel {
                         :http-server-root "public" ;; this will be in resources/
                         :ring-handler    webapp.framework.server.core/app
                         :css-dirs ["resources/public"]
                         }

              :source-paths ["src" "srcbase"]
              :cljsbuild
              {
               :builds
               [
                {
                 :source-paths ["src" "srcbase"]
                 :compiler     {
                                :preamble       ["public/react.min.js"]
                                :output-to      "resources/public/main.js"
                                :output-dir     "resources/public/out/"
                                :optimizations  :none
                                ;:output-wrapper false
                                ;:externs        ["resources/public/google_maps_api_v3_11.js"]
                                ;:pretty-print   false
                                :cache-analysis true
                                :source-map-timestamp true
                                :source-map true
                                }
                 }
                ]

               }
              }


             :test
             {
              :source-paths ["src" "../srctest"]
              :cljsbuild
              {
               :builds
               [
                {
                 :source-paths ["src"]
                 :compiler     {
                                :output-to      "resources/public/main.js"
                                :optimizations  :advanced
                                :output-wrapper false
                                :externs        ["resources/public/jquery-externs.js"
                                                 "resources/public/google_maps_api_v3_11.js"
                                                 "resources/public/reactextern.js"]
                                :pretty-print   false
                                :foreign-libs [{:file "https://maps.googleapis.com/maps/api/js?sensor=false"
                                                :provides  ["google.maps" "google.maps.MapTypeId"]}]
                                }
                 }
                ]

               }
              }

             :prod
             {
              :figwheel false
              :source-paths ["src" "../srcprod"]
              :cljsbuild
              {
               :builds
               [
                {
                 :source-paths ["src"]
                 :compiler     {
                                :output-to      "resources/public/main.js"
                                :optimizations  :advanced
                                :output-wrapper false
                                :externs        ["resources/public/jquery-externs.js"
                                                 "resources/public/google_maps_api_v3_11.js"
                                                 "resources/public/reactextern.js"]
                                :pretty-print   false
                                :foreign-libs [{:file "https://maps.googleapis.com/maps/api/js?sensor=false"
                                                :provides  ["google.maps" "google.maps.MapTypeId"]}]
                                }
                 }
                ]

               }
              }
             }


  :ring {:init       webapp.server.fns/main-init
         :handler    webapp.framework.server.core/app}


  )
