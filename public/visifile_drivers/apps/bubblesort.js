function() {
/*
base_component_id("bubblesort")
display_name("Bubble sort")
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


    var unsorted = [];
    var max = 200
    var sizeArray = 12

    for( var cc = 0 ; cc< sizeArray; cc++){
        unsorted.push(Math.floor(Math.random() * max))
    }


    var sorted = bubbleSort(unsorted);

    console.log('Sorted array', sorted);

}
