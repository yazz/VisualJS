function getPower(decimalPlaces) {
    return 10 ** decimalPlaces;
}

function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
}

function roundToDecimalPlace(number, decimalPlaces = 2) {
    const round = getPower(decimalPlaces);
    return Math.round(number * round) / round;
}



export { capitalize, roundToDecimalPlace }