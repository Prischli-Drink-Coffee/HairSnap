import Cookies from "js-cookie";

export const getToken = () => {
  const token = Cookies.get("token");
  if (token === undefined) {
    return token;
  }
  return `Bearer ${token}`;
};

export const getRole = () => {
  return Cookies.get("role");
};

export const setUser = (user) => {
  Cookies.set("token", user.token, { expires: 365 ** 2 });
  Cookies.set("role", user.userRole, { expires: 365 ** 2 });
  Cookies.set("warehouseId", user.warehouseId, { expires: 365 ** 2 });
  Cookies.set("userName", user.userName, { expires: 365 ** 2 });
};

export const deleteUser = () => {
  Cookies.remove("token");
  Cookies.remove("role");
  Cookies.remove("warehouseId");
  Cookies.remove("userName");
};
