import api from '@/utils/api';


export const getClockedInStaff = () => api.get('/manager/staff-active');

export const getStaffLogs = () => api.get('/manager/staff-logs');
export const setPerimeter = (data) => api.post('/manager/set-perimeter', data);

export const getAllEmployees = () => api.get('/manager/getAllEmployee');

export const getStaffLogsByEmployee = (employeeId) =>
    api.get(`/manager/staff-logs/${employeeId}`);
