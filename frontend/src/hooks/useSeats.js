import { useQuery } from "@tanstack/react-query";
import { APIClient } from "../services/api-client";

const apiClient = new APIClient("/seats");

const useSeats = (id) =>
  useQuery({
    queryKey: ["seats", id],
    queryFn: () => apiClient.getOne(id),
    enabled: !!id, // Only run the query if `id` is available
  });

export default useSeats;
