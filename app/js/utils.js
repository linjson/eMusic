function fileZero(num) {
    if (num < 10) {
        return "0" + num;
    }
    return num + "";
}

function formatDate(length) {
    if (length===undefined) {
        return "";
    }

    let m = fileZero(parseInt(length / 60));
    let s = fileZero(parseInt(length % 60));

    return `${m}:${s}`;

}

module.exports = {
    formatDate,
}