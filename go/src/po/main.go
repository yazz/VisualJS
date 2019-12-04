package main

import (
    "fmt"
    "os"
)

func main() {

    programPath     := os.Args
    argsWithoutProg := os.Args[1:]


    fmt.Println("Welcome to Yazz Pilot")

    fmt.Println(programPath)
    fmt.Println(argsWithoutProg)

    var argsLength = len(argsWithoutProg)
    fmt.Println("Arg count:", argsLength )
    if (argsLength == 0) {
        fmt.Println("Welcome to the Yazz Pilot command line")
    }
    if (argsLength >= 1) {
        fmt.Println("1 arg")
    }
}
