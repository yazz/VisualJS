(ns webapp.framework.server.speech
  (:use [clojure.data.json :as json]
        [fs.core :as fs])
  (:require [clj-http.client :as client])
  (:import (javax.sound.sampled AudioFormat
                                AudioSystem
                                AudioInputStream
                                AudioFileFormat
                                AudioFileFormat$Type)
           (javaFlacEncoder FLAC_FileEncoder
                            StreamConfiguration)))

(def ^:dynamic *google-url*
  "https://www.google.com/speech-api/v1/recognize?xjerr=1&client=chromium&lang=en-US&Name=ds")

(def ^:dynamic *input-index*
  "Default index of the recording device; NB: this is a hack."
  1)

(def ^:dynamic *sample-rate* 8000)

(def ^:dynamic *sample-size* 16)

(def ^:dynamic *channels* 1)

(def ^:dynamic *signed* true)

(def ^:dynamic *big-endian* false)

(def ^:dynamic *format*
  (new AudioFormat
       *sample-rate*
       *sample-size*
       *channels*
       *signed*
       *big-endian*))

(defn post-to-google [flac]
  (:body
      (client/post
       *google-url*
       {:multipart [["Content" flac]]
        :headers {"Content-type"
                  (format "audio/x-flac; rate=%s" *sample-rate*)}})))

(defn sort-hypotheses [hypotheses]
  (sort-by (fn [hypothesis]
                 (let [{utterance :utterance confidence :confidence}
                       hypothesis]
                   confidence))
              >
              hypotheses))

(defn parse-response [response]
  (let [{status :status
         id :id
         hypotheses :hypotheses}
        (json/read-json response)
        {utterance :utterance
         confidence :confidence}
        (first (sort-hypotheses hypotheses))]
    utterance))

(defn hear []
  (let [
        ;mixer-info (clojure.core/get (AudioSystem/getMixerInfo) *input-index*)
        ;target  (AudioSystem/getTargetDataLine *format* mixer-info)
          format (AudioFormat. 8000.0, 16, 1, true, true)
       target (AudioSystem/getTargetDataLine format)
        ]
    ;; `with-open'?
    (.open target *format*)
    (println "I'm listening.")
    (.start target)
    (.start (Thread.
             (fn []
                ;(read-line)
                (.flush target)
                (.stop target)
                (.close target)
                (println "I'm considering."))))
    (let [input-stream (new AudioInputStream target)]
      (let [wave (fs/temp-file "hear" ".wav")
            flac (fs/temp-file "hear" ".flac")]
        (AudioSystem/write input-stream
                           AudioFileFormat$Type/WAVE
                           wave)
        (let [encoder (new FLAC_FileEncoder)]
          (.setStreamConfig encoder
                            (new StreamConfiguration
                                 *channels*
                                 StreamConfiguration/DEFAULT_MIN_BLOCK_SIZE
                                 StreamConfiguration/DEFAULT_MAX_BLOCK_SIZE
                                 *sample-rate*
                                 *sample-size*))
          (.encode encoder wave flac)
          (parse-response (post-to-google flac)))))))




;(println (str (hear)))
;(def mixer-info
;  (AudioFormat. 8000.0, 16, 1, true, true))

;mixer-info

;(AudioSystem/getTargetDataLine *format* mixer-info)