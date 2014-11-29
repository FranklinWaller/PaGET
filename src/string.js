var stringFunc = {
    beginsWith: function(needle, haystack){
        return (haystack.substr(0, needle.length) == needle);
    },

    explode: function(str, delimiter){
        return str.split(delimiter);
    }
};



module.exports = stringFunc;