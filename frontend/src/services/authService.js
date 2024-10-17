import {APIClient} from "./api-client";

const apiClient = new APIClient("/auth");

class AuthService {
  AuthenticateUser(admin) {
    return apiClient.post(admin);
  }
}

export default new AuthService();
