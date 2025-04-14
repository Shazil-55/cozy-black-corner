
import api from "./api";
import { UserRoles, DashboardResponse, ApiResponse } from "@/types/dashboard";

export const dashboardService = {
  getDashboardData: async (role: UserRoles): Promise<ApiResponse<DashboardResponse>> => {
    const response = await api.get(`/user/dashboard?role=${role}`);
    return response.data;
  },
};
