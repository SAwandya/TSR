import { useQuery } from "@tanstack/react-query";
import { APIClient } from "../services/api-client";

const apiClient = new APIClient("/theaters");

const useTheaters = () =>
  useQuery({
    queryKey: ["theaters"],
    queryFn: () => apiClient.getAll(),
  });

export default useTheaters;
