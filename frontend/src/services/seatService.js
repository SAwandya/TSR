import { APIClient } from "./api-client";

const apiClient = new APIClient("/seats");

class SeatService {
  CreateSeat(seat) {
    return apiClient.post(seat);
  }
}

export default new SeatService();
