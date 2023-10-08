import axios from "axios";

const URL = process.env.REACT_APP_URL;
export default class UserService {
  static postData(payload) {
    return axios.post(URL + "/user", payload);
  }
  static updateData(payload, id) {
    return axios.put(URL + "/user/" + id, payload);
  }
  static getUsers() {
    return axios.get(URL + "/users");
  }
  static getUser(id) {
    return axios.get(URL + "/user/" + id);
  }
  static deleteUser(id) {
    return axios.delete(URL + "/user/" + id);
  }
}
