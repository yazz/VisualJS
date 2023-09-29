#!/bin/bash

while true
      do
          node src/electron.js --port 443 --public $1 --private $2 --host $3  --usehost $3  --https true  --hostport 443 --centralhost $3  --centralhostport 443 --centralhosthttps true --cacert1 $4    --cacert2 $5    --cacert3 $6   --showdebug true  --virtualprocessors 20   --hideimportbuttons true   --synctomaster false  --deleteonstartup true  --deleteonexit true  > nohup.out
      done


