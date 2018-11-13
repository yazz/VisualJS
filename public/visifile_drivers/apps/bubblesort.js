function() {
/*
base_component_id("bubblesort")
*/

function bubbleSort(a) {
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < a.length-1; i++) {
            if (a[i] > a[i+1]) {
                var temp = a[i];
                a[i] = a[i+1];
                a[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return a
}

    var unsorted = [23, 45, 16, 37, 3, 99, 22];
    var sorted = bubbleSort(unsorted);

    console.log('Sorted array', sorted);

}
