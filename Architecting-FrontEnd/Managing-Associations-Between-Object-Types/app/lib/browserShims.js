/* jshint browser: true */
'use strict';
/**
 * Implements the trim function for browsers 
 * that don't support it natively
 */
if (!String.prototype.trim) {  
  String.prototype.trim = function () {  
    return this.replace(/^\s+|\s+$/g,'');  
  };  
}
/**
 * Implement some ECMASCRIPT6 methods for browsers 
 * that don't support them natively
 */
if (!Number.isInteger) {
  Number.isInteger = function isInteger (nVal) {
    return typeof nVal === "number" && isFinite(nVal) && 
        nVal > -9007199254740992 && nVal < 9007199254740992 && 
        Math.floor(nVal) === nVal;
  };
}
if (!String.prototype.includes) {
  String.prototype.includes = function () {
    return String.prototype.indexOf.apply( this, arguments ) !== -1;
  };
}
if (!Array.prototype.includes) {
  Array.prototype.includes = function () {
    return Array.prototype.indexOf.apply( this, arguments ) !== -1;
  };
}
/**
 * Compute the max/min of an array
 * Notice that apply requires a context object, which is not really used
 * in the case of a static function such as Math.max
 */
Array.max = function (array) {
  return Math.max.apply( Math, array);
}; 
Array.min = function (array) {
  return Math.min.apply( Math, array);
};
/**
 * Clone an array
 */
Array.prototype.clone = function () {
  return this.slice(0);
}; 
/**
 * Test if an array is equal to another
 */
Array.prototype.isEqualTo = function (a2) {
  return (this.length === a2.length) && this.every( function( el, i) {
    return el === a2[i]; });
};
/**
 * Return an array of the values of an object
 */
if (!Object.values) {
  Object.values = function (obj) {
    return Object.keys(obj).map( function (key) {
        return obj[key];
      });
  };
}

