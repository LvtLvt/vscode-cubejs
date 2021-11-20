export function prettyLog(obj: {}) {
  console.log(JSON.stringify(obj, null, 2));
}

export function toPlainObject(obj: Record<string, any>) {
  const ret: Record<string, any> = {};

  for (const key in obj) {

    function getValueImpl(value: any) {

      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          value[i] = getValueImpl(value[i]);
        }
      } else if (typeof value === 'object') {
        return toPlainObject(value);
      }

      return value;
    }

    const value = getValueImpl(obj[key]);
    if (value !== undefined && value !== null) {
      ret[key] = value;
    }
  }

  return ret;
}
