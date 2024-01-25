function() {
/*
base_component_id("quicksort")
hash_algorithm("SHA256")
display_name("Quick sort")

*/

    function quicksort(array) {
      if (array.length <= 1) {
        return array;
      }

      var pivot = array[0];

      var left = [];
      var right = [];

      for (var i = 1; i < array.length; i++) {
        array[i] < pivot ? left.push(array[i]) : right.push(array[i]);
      }

      return quicksort(left).concat(pivot, quicksort(right));
    };

    var unsorted = [];
    var max = 100
    var sizeArray = 10

    for( var cc = 0 ; cc< sizeArray; cc++){
        unsorted.push(Math.floor(Math.random() * max))
    }
    var sorted = quicksort(unsorted);

    console.log('Sorted array', sorted);

}
