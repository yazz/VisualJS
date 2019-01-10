async function() {
/*
created_timestamp(1547098945116)
base_component_id("tensorflow")
visibility("PUBLIC")
is_app(true)
read_only(true)
logo_url("https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/TensorFlowLogo.svg/2000px-TensorFlowLogo.svg.png")
uses_javascript_librararies(["aframe"])
display_name("TensorFlow")
*/
    console.log("TensorFlow AI demo in Javascript")
    console.log("Please wait")
    console.log("")
    console.log("Training AI...")
    console.log("")

    var model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    model.compile({
       loss: 'meanSquaredError',
       optimizer: 'sgd'
    });
    var xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    var ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    await model.fit(xs, ys, {epochs: 500});
    console.log(model.predict(tf.tensor2d([11], [1, 1])))
}
