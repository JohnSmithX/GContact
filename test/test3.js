var reduce = function(a, f, initial) {
    var i = 0, len = a.length, accumulator;

    if (arguments.length > 2) {
        accumulator = initial;
    } else {
        if (len == 0) { throw TypeError(); }
        while (i < len) {
            if (i in a) {
                accumulator = a[i++];
                break;
            }
            i++;
        }
        if (i == len) { throw TypeError(); }
    }

    while (i < len) {
        if (i in a) {
            accumulator = f.call(undefined, accumulator, a[i], i, a);
        }
        i++;
    }
    return accumulator;
};

console.log(reduce([1, 2, 3], function(x, y) {return x + y;}));