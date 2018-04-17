function Select-Nth {
    param([int]$N) 

    $Input | Select-Object -First $N | Select-Object -Last 1
}
