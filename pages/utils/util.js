import { ToastAndroid } from "react-native";

export const pathName = "https://api.itooi.cn/music/netease/";

export function ajax(url, sucFun) {
  return fetch(pathName + url, {
    // method: "post",
    headers: {
      "X-Requested-With": "XMLHttpRequest"
    }
    // body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(res => {
      sucFun(res);
    })
    .catch(error => {
      ToastAndroid.showWithGravity(
        error,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    });
}

export function numFormat(num) {
  if (num != "") {
    if (num < 10000) {
      return num;
    } else if (num >= 10000 && num < 100000000) {
      return Math.floor(num / 10000) + "万";
    } else {
      return Math.floor(num / 100000000) + "亿";
    }
  } else {
    return "";
  }
}
