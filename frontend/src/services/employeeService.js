import { APIClient } from "./api-client";

const apiClient = new APIClient("/employees");

class EmployeeService {
  Create(user) {
    return apiClient.post(user);
  };
  Delete(id) {
    return apiClient.delete(id);
  };
  Update(user, id) {
    return apiClient.put(user, id);
  }
}

export default new EmployeeService();
