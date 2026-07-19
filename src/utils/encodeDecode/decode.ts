const decoding = (str: string) => {
  try {
    let result = decodeURIComponent(str);
    for (let i = 0; i < 9; i++) {
      result = atob(result);
    }
    return result;
  } catch {
    console.error("Decoding failed. Invalid string:", str);
    return null;
  }
};

export default decoding;