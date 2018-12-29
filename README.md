# JStation
### Build internal tools visually with JavaScript

- An interactive editor to create GUI apps in the style of Visual Basic 6
- Each app has a built in full SQL database
- Each app can be viewed as a self contained HTML file
- Uses the Dannea app all documents can be run as a multiuser app
- All documents can be edited in the cloud, no installation for end users
- Apps work offline as well

http://dannea.com

: Key workflow :

1) Download JStation for Windows or OS X from dannea.com
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
    git clone https://github.com/zubairq/jstation.git
##### 4) Go to the jstation directory
    cd creator
##### 5) Install the NodeJS modules
    npm install
##### 6) Install SQlite3 for Electron
    Copy 
        node_macos64/node_sqlite3.noderename
    to 
        node_modules/sqlite3/lib/binding/node-v57-darwin-x64/node_sqlite3.node
##### 7) Run the Dannea Electron application
    electron .



### To build the Mac .app you also need to 
##### 1) Install SQlite3 for Electron
    sudo npm install sqlite3 --build-from-source --runtime=electron --target=1.8.4 --dist-url=https://atom.io/download/electron (this step may not be needed on some platforms)
##### 2) Run electron packager
    Sudo electron-forge make



### What is JStation's killer feature?

JStation's killer feature is being able to build simple internal business apps fast

### Is there commercial support for JStation?
If you require commercial support then please go to http://dannea.com
