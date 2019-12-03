
# Yazz Pilot
## Serverless Javascript Framework

Pilot is a Kubernetes tool which lets you quickly run build and run small web based tools or micro services. To build web based tools there is a drag and drop builder, and to build micro services there is a simple Javascript based syntax.

## Install Yazz Pilot

Run from docker:

    docker run -p 80:80 -d zubairq/pilot


Run as a Snap package on Linux:

    snap install --devmode --edge pilot

    pilot

[![Get it from the Snap Store](https://snapcraft.io/static/images/badges/en/snap-store-black.svg)](https://snapcraft.io/pilot)



Public Demo- https://yazz.com/app/homepage.html

- Build apps in minutes with drag and drop interface and code business logic in Javascript
- One click deploy to Docker or Kubernetes
- Open source MIT license
- Runs in Docker on the cloud
- Runs locally on NodeJS
- Can be run as a Snap Package on Linux




<br /><br /><br /><br /><br />





## Docker Quick start
##### 1) Download and run Docker

##### 2) Expose the Docker REST api on port 1234 with:
    docker run -d -v /var/run/docker.sock:/var/run/docker.sock -p 127.0.0.1:1234:1234 bobrik/socat TCP-LISTEN:1234,fork UNIX-CONNECT:/var/run/docker.sock

##### 3) Install and run the Pilot IDE with:

    docker run -p 80:80 -d zubairq/pilot

##### 4) Go to a browser and view Pilot:

    http://localhost







<br /><br /><br /><br /><br />








## Building Pilot from source on Linux:

##### 1) Install GIT from https://git-scm.com/downloads
##### 2) Install Node.js 8.9 64 bit installer from https://nodejs.org/en/download/
##### 3) From the command line get the Git repository
    git clone https://github.com/zubairq/pilot.git
##### 4) Go to the "pilot" directory
    cd pilot
##### 5) Install the NodeJS modules
    sudo npm config set strict-ssl false    

    sudo npm install --unsafe-perm


##### 6) Run the Pilot NodeJS application

    node /src/electron.js --runapp homepage --locked false

##### 7) Create the "yazz" shell command to replace "node src/electron.js"

    sudo npm link


<br /><br /><br /><br /><br />






## Building Pilot from source on Windows


##### 1) Install GIT from https://git-scm.com/downloads
##### 2) Install Node.js 8.9 64 bit installer from https://nodejs.org/en/download/
##### 3) From the command line get the Git repository
    git clone https://github.com/zubairq/pilot.git
##### 4) Go to the Pilot directory
    cd pilot
##### 5) Install the NodeJS modules
    npm install
##### 6) Run as Node.js application with browser based access

     node .\src\electron.js --runapp homepage --locked false





<br /><br /><br /><br /><br />







## Building Pilot from source on Mac:

##### 1) Install GIT from https://git-scm.com/downloads
##### 2) Install Node.js 8.9 64 bit installer from https://nodejs.org/en/download/
##### 3) From the command line get the Git repository
    git clone https://github.com/zubairq/pilot.git
##### 4) Go to the Pilot directory
    cd pilot
##### 5) Install the NodeJS modules
    npm install
##### 6) Run as Node.js application with browser based access

     node src/electron.js --runapp homepage --locked false







<br /><br /><br /><br /><br />










<br /><br /><br /><br /><br />





## Command line options:

    --help                 output usage information
    --version              output the version number
    --port                 Which port should I listen on? Default 80 or 3000 (if not run as sudo)
    --host                 Server address of the central host (default is local machine IP address)
    --locked               Allow server to be locked/unlocked on start up to other machines in intranet (default true)
    --deleteonexit         Delete database files on exit (default false)
    --deleteonstartup      Delete database files on startup (default false)
    --runapp               Run using a local app on startup (default not set). "homepage" often used
    --https                Run using a HTTPS (default is false)
    --private              Private HTTPS key location
    --public               Public HTTPS certificate location






<br /><br /><br /><br /><br />








### FAQ

#### What is Pilot's killer feature?

Pilot's killer feature is being able to build Kubernetes applications in minutes, without having to setup Jenkins pipelines, Git, or anything else. It is ideal for demos or small throwaway apps.

#### Is there commercial support for Pilot?
If you require commercial support then please go to http://yazz.com
