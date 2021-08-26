/**
 * Function to get time formatted in local time zone
 * @param {Number} timeInMilliseconds - time in ms
 * @returns formatted time
 * Example: 23:10
 */
export const getLocalTimeZoneFormattedTime = (timeInMilliseconds) => {
  return new Date(+timeInMilliseconds).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Function to read JSON file
 * @param {String} filePath - path of JSON file to read
 * @param {Function} callback - callback function to be invoked after successful reading of JSON file
 */
export const readJsonFile = async (filePath, callback) => {
  const rawJsonFile = new XMLHttpRequest();
  rawJsonFile.overrideMimeType("application/json");
  await rawJsonFile.open("GET", filePath, true);
  rawJsonFile.onreadystatechange = () => {
    if (rawJsonFile.readyState === 4 && rawJsonFile.status == "200") {
      callback(rawJsonFile.responseText);
    }
  };
  rawJsonFile.send(null);
};
