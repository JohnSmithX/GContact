function memorize(f) {
    var cache = {};
    return function () {
        var key = arguments.length + Array.prototype.join.call(arguments, ',');

        if (!cache.hasOwnProperty(key)) {
            cache[key] = f.apply(this, arguments);
        }
        return cache[key];
    };
}

function gcd(a, b) {
    var t;
    if (a < b) {
        t = b;
        b = a;
        a = t;
    }

    while (b != 0) {
        t = b;
        b = a % b;
        a = t;
    }
    return a;
}

var gcdmemo = memorize(gcd);

console.log(gcdmemo(85, 187));
console.log(gcdmemo(85, 187));
