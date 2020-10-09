function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // eslint-disable-next-line no-restricted-properties
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const formatDate = (date, format) => {
  let result = format || '{hh}:{mm}:{ss}.{ms} {DD}.{MM}.{YYYY}';
  const d = date || new Date();
  // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
  // https://flaviocopes.com/javascript-dates/
  const parts = {
    YYYY: d.getFullYear(),
    MM: d.getMonth() + 1,
    DD: d.getDate(),
    hh: d.getHours(),
    mm: d.getMinutes(),
    ss: d.getSeconds(),
    ms: d.getMilliseconds(),
  };
  Object.keys(parts).forEach((k) => { result = result.replace(`{${k}}`, parts[k]); });
  return result;
};

const formatInterval = (d1, d2) => {
  let result = '';

  const dms = d2 - d1; // diff ms
  const ms = dms % 1000;
  const dss = (dms - ms) / 1000;
  result = `${ms}${result}`;

  if (!dss) { return `${result} ms`; }

  const ss = dss % 60;
  const dmm = (dss - ss) / 60;
  result = `${(ss + (ms / 1000)).toString()}`;

  if (!dmm) { return `${result} sec`; }

  const mm = dmm % 60;
  const dhh = (dmm - mm) / 60;
  result = `${mm}:${result}`;

  if (!dhh) { return result; }

  const hh = dhh % 24;
  const ddd = (dhh - hh) / 24;
  result = `${hh}:${result}`;

  if (!ddd) { return result; }

  return `${ddd}d ${result}`;
};

module.exports = {
  formatBytes,
  formatDate,
  formatInterval,
}