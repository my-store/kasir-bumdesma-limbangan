export function percentage(partial, total) {
  return (100 * partial) / total;
}

export function numberFormat(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function upperCase(str) {
  const splitStr = str.split(" ");
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

export function makeUniqueId(length) {
  const date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth();
  let result = [];
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
    year +
    month;
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}
