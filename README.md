# Yazz
### Visual Basic 6 reimagined in Javascript

- An interactive editor to create GUI apps in the style of Visual Basic 6
- Build business logic in Javascript
- Each app has a built in full SQL database
- Apps can be downloaded and emailed within your intranet

http://yazz.com

: Key workflow :

1) Download Yazz for Windows or OS X from yazz.com
2) Create an app with drag and drop editor
3) Share the URL with a colleage

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
    git clone https://github.com/zubairq/yazz.git
##### 4) Go to the yazz directory
    cd yazz
##### 5) Install the NodeJS modules
    npm install
##### 6) Install SQlite3 for Electron
    Copy
        node_macos64/node_sqlite3.noderename
    to
        node_modules/sqlite3/lib/binding/node-v57-darwin-x64/node_sqlite3.node
##### 7) Run the Yazz Electron application
    electron .



### To build the Mac .app you also need to
##### 1) Install SQlite3 for Electron
    sudo npm install sqlite3 --build-from-source --runtime=electron --target=1.8.4 --dist-url=https://atom.io/download/electron (this step may not be needed on some platforms)
##### 2) Run electron packager
    Sudo electron-forge make



### What is Yazz's killer feature?

Yazz's killer feature is being able to build simple internal business apps fast. It enables this by allowing all apps to be made with our drag and drop editor and the Javascript and SQL scripting language

### Is there commercial support for Yazz?
If you require commercial support then please go to http://yazz.com
