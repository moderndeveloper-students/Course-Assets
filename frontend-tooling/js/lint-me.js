myArg = true;

var fn = function (arg) {
  arg = arg || myArg;
  return arg;
}