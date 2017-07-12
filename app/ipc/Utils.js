const keymirror = function keyMirror(obj) {
    var ret = {};
    var key;
    if (obj instanceof Object && !Array.isArray(obj)) {
        for (key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            ret[key] = key;
        }
    }
    return ret;
};

const sumBy = (list, fn) => {
    let sum = 0;
    list.forEach(n => {
        let v = fn(n) || 0;
        sum += v;
    });
    return sum;
}

module.exports = {
    keymirror, sumBy
};