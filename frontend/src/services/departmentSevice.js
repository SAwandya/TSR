import { APIClient } from "./api-client";

const apiClient = new APIClient("/departments");

class DepartmentService {
  Create(dept) {
    return apiClient.post(dept);
  }
  Delete(id) {
    return apiClient.delete(id);
  }
  Update(dept, id) {
    return apiClient.put(dept, id);
  }
}

export default new DepartmentService();
