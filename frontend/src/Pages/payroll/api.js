import axios from 'axios';
import BASE_URL from "../config/config";
import api from '../config/api';

const API_URL = `${BASE_URL}/api/payroll`; // Adjust to your backend URL

// Function to generate payroll
export const generatePayroll = async (month, year) => {
  try {
    const response = await api.get(`/generatePayroll`, {
      params: { month, year },
    });
    return response.data;
  } catch (error) {
    console.error("Error generating payroll:", error);
    throw error;
  }
};

// Function to fetch payroll records for a specific employee
export const getEmployeePayroll = async (employeeId, month, year) => {
  try {
    const response = await api.get(`/employeePayroll`, {
      params: { employeeId, month, year },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payroll:", error);
    throw error;
  }
};
