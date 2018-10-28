# AppShare
Appshare is an App Store for HTML Apps. It has a VB 6 style editor to build apps easily. It can be used on the web, or as a Windows/Mac Os X app. There is demo here:

http://appshare.co

: Key workflow :

1) Open Appshare.co or download for Windows/OS X and open the Electron app
2) Create an app with drag and drop editor
3) Download the app to your local machine as a HTML file
4) Email the app to someone
5) When they get the email then they can run the app
6) If they want to edit the app they press "Edit" at the top of the running app
7) Congratulations, someone has just forked your app! :)


: Made with :

- Electron
- VueJS
- Sqlite
- Javascript
- NodeJS

Command line options :

    -h, --help                 output usage information
    -V, --version              output the version number
    -t, --type [type]          Add the specified type of app [type]
    -p, --port [port]          Which port should I listen on? [port]
    -h, --host [host]          Server address of the central host [host]
    -s, --hostport [hostport]  Server port of the central host [hostport]
    


### Developer quick start


##### 1) Install GIT from https://git-scm.com/downloads
##### 2) Install Node.js 8.9 64 bit installer from https://nodejs.org/en/download/
##### 3) From the command line get the Git repository
    git clone https://github.com/zubairq/appshare.git
##### 4) Go to the AppShare directory
    cd appshare
##### 5) Install the NodeJS modules
    npm install
##### 6) Install SQlite3 for Electron
    Copy 
        node_macos64/node_sqlite3.noderename
    to 
        node_modules/sqlite3/lib/binding/node-v57-darwin-x64/node_sqlite3.node
##### 7) Run the AppShare Electron application
    electron .



### To build the Mac .app you also need to 
##### 1) Install SQlite3 for Electron
    sudo npm install sqlite3 --build-from-source --runtime=electron --target=1.8.4 --dist-url=https://atom.io/download/electron (this step may not be needed on some platforms)
##### 2) Run electron packager
    Sudo electron-forge make



### What is AppShare's killer feature?

AppShare's killer feature is being able to build simple internal apps fast.

### Is there commercial support for AppShare?
If you require commercial support then please go to http://appshare.co
