const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const encode = (num) => {
    let str = "";
    while (num > 0) {
        str = CHARS[num % 62] + str;
        num = Math.floor(num / 62);
    }
    return str || "0";
};

// This is the part that might be causing the error:
module.exports = { encode };