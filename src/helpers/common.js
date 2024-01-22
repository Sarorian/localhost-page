import { toast } from "react-toastify";

const common = {
  displayMessage: (level, errorMsg) => {
    let msg = "";
    switch (true) {
      case /.*Firebase.*auth\/too-many-requests.*/.test(errorMsg):
        msg = "Error 403. Too many authentication requests";
        break;
      case /.*Firebase.*auth.*/.test(errorMsg):
        msg = "Error 400. Authentication error";
        break;
      default:
        msg = errorMsg;
        break;
    }
    return toast[level](msg);
  },
};

export default common;
