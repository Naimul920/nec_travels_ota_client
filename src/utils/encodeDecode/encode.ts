const encoding = (str: string) => {
  let result = str;
  for (let i = 0; i < 9; i++) {
    result = btoa(result);
  }
  return encodeURIComponent(result);
};

export default encoding;
