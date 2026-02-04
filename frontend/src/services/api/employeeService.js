import api from "../../Pages/config/api";


export const createEmployeeApi = async (formData) => {
  const response = await api.post("/api/employee", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};



export const fetchEmployees = async (params = {}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
    account = "",
    includeFNF = false,
    sortBy = "createdAt",
    order = "desc",
  } = params;

  try {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sortBy,
      order,
    });

    // Only append meaningful filters
    if (search.trim()) queryParams.append("search", search.trim());
    if (status) queryParams.append("status", status);
    if (account) queryParams.append("account", account);
    if (includeFNF) queryParams.append("includeFNF", "true");

    const { data } = await api.get(`/api/employeeTable?${queryParams}`);

    return data;
  } catch (error) {
    console.error("[fetchEmployees] Error:", error);

    throw {
      success: false,
      message: "Unable to fetch employee list",
      error: error?.response?.data?.message || error.message,
    };
  }
};;

export const exportAllEmployees = async ({
  search = "",
  status = "",
  account = "",
  includeFNF = false,
  sortBy = "createdAt",
  order = "desc",
} = {}) => {
  try {
    const { data } = await api.get("/api/employee/export", {
      params: {
        search,
        status,
        account,
        includeFNF,
        sortBy,
        order,
      },
    });

    return data;
  } catch (error) {
    console.error("Error exporting employees:", error);

    throw (
      error?.response?.data || {
        success: false,
        message: "Unable to export employees. Please try again.",
      }
    );
  }
};


