exports.removeEmpty = function (obj) {
  const newObj = {};
  for (let key in obj) {
    const val = obj[key];
    if (!(val == null || val.length === 0)) {
      newObj[key] = val;
    }
  }
  return newObj;
}