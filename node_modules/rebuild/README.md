# Rebuild

Rebuild is a simple utility that does just one thing: it watches one or more files or directories for changes and runs a command when they change. That's it. It's intended to be used with command line build systems, but you can't really use it for anything.

## Installation

    npm install rebuild -g

## Usage

Specify any number of files or directories using `-w` or `--watch`. Then just include whatever command you want to run. For example, if you just want to run `ls` whenever files in the `tmp` directory change, you would do this:

    rebuild -w tmp ls

The directory is resolved based on the current working directory for both the files and directories to watch and the command to run. Other examples:

    # Run "ant test" when the files in src change
    rebuild -w src ant test
    
    # Automatically check in files in src and docs when they change
    rebuild -w src -w docs git commit -am "Just wanted to check these in"
    