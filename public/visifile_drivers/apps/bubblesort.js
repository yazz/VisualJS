function() {
/*
base_component_id("bubblesort")
display_name("Bubble sort")
is_app(true)
visibility("PUBLIC")
only_run_on_frontend(true)
read_only(true)
component_type("APP")
logo_url("/bubblesort.jpeg")
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


    var aUnsorted = [];
    var max = 200
    var sizeArray = 12

    for( var cc = 0 ; cc< sizeArray; cc++){
        aUnsorted.push(Math.floor(Math.random() * max))
    }


    var aSorted = bubbleSort(aUnsorted);

    console.log('Sorted array', aSorted);

}
