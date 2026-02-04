import api from "../../Pages/config/api";
import { useQuery } from "@tanstack/react-query";

export const getMyTasks = async () => {
  const res = await api.get("/api/tasksMyTask");
  return res.data;
};

// Hooks

export const useMyTasks = () => {
  return useQuery({
    queryKey: ["my-tasks"],
    queryFn: getMyTasks,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};