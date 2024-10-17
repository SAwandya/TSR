import { useQuery } from "@tanstack/react-query";
import { APIClient } from "../services/api-client";

const apiClient = new APIClient("/departments");

const useDepartment = (id) =>
  useQuery({
    queryKey: ["departments", id],
    queryFn: () => apiClient.getOne(id),
  });

export default useDepartment;
