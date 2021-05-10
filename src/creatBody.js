let createBody = details => {
  let body = [];
  for (let key in details) {
    let ek = encodeURIComponent(key);
    let ep = encodeURIComponent(details[key]);
    body.push(ek + '=' + ep);
  }
  body = body.join('&');
  return body;
};
export default createBody;
