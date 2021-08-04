export function resultSuccess(data, { message = "ok" } = {}) {
  return {
    code: 200,
    data,
    message,
    type: "success"
  };
}

export function resultError(message = "Request failed", { code = -1, data = null } = {}) {
  return {
    code,
    data,
    message,
    type: "error"
  };
}
