var kava = function() {
var i = 1;
var kava_array = [];
var a = 0;
var b = 0;

while (i <= 26) {
    if(i > 12) {
    b = 1;
        if (i > 22) {
            a = 3;
        } else if (i < 23 && i > 18) {
            a = 2;
        } else if (i === 18) {
            a = 11;
        } else if (i === 17) {
            a = 10;
        } else if (i === 16) {
            a = 4;
        } else {
            a = 0;
        }
    } else {
        if (i > 8 && i <= 12) {
            b = 2;
                if (i === 12) {
                    a = 11;
                } else if (i === 11) {
                    a = 10;
                } else if (i === 10) {
                    a = 4;
                } else {
                    a = 0;
                }
        } else if (i < 9 && i > 4) {
            b = 3;
                if (i === 8) {
                    a = 11;
                } else if (i === 7) {
                    a = 10;
                } else if (i === 6) {
                    a = 4;
                } else {
                    a = 0;
                }
        } else if (i <= 4) {
            b = 4;
                if (i === 4) {
                    a = 11;
                } else if (i === 3) {
                    a = 10;
                } else if (i === 2) {
                    a = 4;
                } else {
                    a = 0;
                }
        }       
    }
    kava_array.push([i, a, b]); 
    i++;
} return kava_array;
};

var sajaukt = function(sajaukt) {
//+ Jonas Raoni Soares Silva
var shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};
//@ http://jsfromhell.com/array/shuffle [rev. #1]
    var sajaukta_kava = shuffle(sajaukt);
    return sajaukta_kava;
}; 

var sajauktas_kartis = sajaukt(kava());

exports.array = kava();
exports.sajaukt = sajaukt(sajaukt);