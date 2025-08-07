'use client';
import React, { useEffect, useState } from 'react';
import {
    MapPin, Users, ChevronDown, ChevronRight,
    Loader, CheckCircle, XCircle
} from 'lucide-react';

import withAuth from '@/hoc/withAuth';
import {
    getClockedInStaff,
    getAllEmployees,
    getStaffLogsByEmployee,
    setPerimeter
} from '@/services/managerService';

const ManagerDashboard = () => {
    const [clockedInStaff, setClockedInStaff] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [expandedLogs, setExpandedLogs] = useState({});
    const [perimeterLoading, setPerimeterLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [perimeter, setPerimeterData] = useState({
        latitude: '',
        longitude: '',
        radiusInMeters: ''
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [clockedRes, employeeRes] = await Promise.all([
                    getClockedInStaff(),
                    getAllEmployees()
                ]);
                setClockedInStaff(clockedRes.data);
                setEmployees(employeeRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setMessage({ type: 'error', text: 'Failed to fetch initial data.' });
            }
        };
        fetchInitialData();
    }, []);

    const handlePerimeterChange = (e) => {
        const { name, value } = e.target;
        setPerimeterData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSetPerimeter = async () => {
        const { latitude, longitude, radiusInMeters } = perimeter;
        setMessage({ type: '', text: '' });

        if (!latitude || !longitude || !radiusInMeters) {
            setMessage({ type: 'error', text: "All perimeter fields are required." });
            return;
        }

        try {
            setPerimeterLoading(true);
            await setPerimeter({
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                radiusInMeters: parseFloat(radiusInMeters),
            });
            setMessage({ type: 'success', text: 'Perimeter set successfully!' });
        } catch (err) {
            console.error('Failed to set perimeter:', err);
            setMessage({ type: 'error', text: 'Error setting perimeter.' });
        } finally {
            setPerimeterLoading(false);
        }
    };

    const toggleEmployeeLogs = async (employeeId) => {
        if (expandedLogs[employeeId]) {
            setExpandedLogs((prev) => {
                const newState = { ...prev };
                delete newState[employeeId];
                return newState;
            });
        } else {
            try {
                const res = await getStaffLogsByEmployee(employeeId);
                setExpandedLogs((prev) => ({
                    ...prev,
                    [employeeId]: res.data
                }));
            } catch (err) {
                console.error('Failed to fetch logs for employee:', err);
                setMessage({ type: 'error', text: 'Error loading staff logs.' });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans p-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">Manager Dashboard</h1>

            {message.text && (
                <div className={`flex items-center gap-2 p-4 mb-6 rounded-lg font-medium ${message.type === 'success'
                    ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                    : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    {message.text}
                </div>
            )}

            {/* Location Perimeter */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mb-6">
                <div className="flex items-center mb-4">
                    <MapPin size={24} className="text-indigo-500 dark:text-indigo-400 mr-2" />
                    <h2 className="text-xl font-bold">Set Location Perimeter</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {['latitude', 'longitude', 'radiusInMeters'].map((field) => (
                        <input
                            key={field}
                            type="number"
                            name={field}
                            value={perimeter[field]}
                            onChange={handlePerimeterChange}
                            placeholder={field.replace(/([A-Z])/g, ' $1')}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                        />
                    ))}
                </div>
                <button
                    onClick={handleSetPerimeter}
                    className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition"
                    disabled={perimeterLoading}
                >
                    {perimeterLoading ? <Loader className="animate-spin" /> : 'Set Perimeter'}
                </button>
            </div>

            {/* Clocked-in Staff */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mb-6">
                <div className="flex items-center mb-4">
                    <Users size={24} className="text-indigo-500 dark:text-indigo-400 mr-2" />
                    <h2 className="text-xl font-bold">Clocked-In Staff</h2>
                </div>
                {clockedInStaff.length === 0 ? (
                    <p className="text-gray-500">No staff currently clocked in.</p>
                ) : (
                    <ul className="space-y-4">
                        {clockedInStaff.map((staff) => (
                            <li key={staff._id} className="p-4 border rounded-lg">
                                <div>
                                    <p className="font-semibold">{staff.employeeId?.name || 'Unknown'}</p>
                                    <p className="text-sm text-gray-500">{staff.employeeId?.email}</p>
                                </div>
                                <div className="text-right mt-2">
                                    <p className="text-sm">Clock In: {new Date(staff.clockInTime).toLocaleString()}</p>
                                    {staff.clockInNote && <p className="text-xs text-gray-400">Note: {staff.clockInNote}</p>}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Staff Logs */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center mb-4">
                    <Users size={24} className="text-indigo-500 dark:text-indigo-400 mr-2" />
                    <h2 className="text-xl font-bold">Staff Logs</h2>
                </div>
                {employees.length === 0 ? (
                    <p className="text-gray-500">No employees found.</p>
                ) : (
                    <ul className="space-y-4">
                        {employees.map((emp) => (
                            <li key={emp._id} className="border-b pb-4">
                                <div
                                    onClick={() => toggleEmployeeLogs(emp._id)}
                                    className="cursor-pointer flex justify-between font-medium"
                                >
                                    <span>{emp.name} ({emp.email})</span>
                                    {expandedLogs[emp._id] ? <ChevronDown /> : <ChevronRight />}
                                </div>
                                {expandedLogs[emp._id] && (
                                    <div className="mt-3 space-y-3">
                                        {expandedLogs[emp._id].length === 0 ? (
                                            <p className="text-gray-500">No logs available.</p>
                                        ) : (
                                            expandedLogs[emp._id].map((log) => (
                                                <div key={log._id} className="border-b pb-2">
                                                    <p>Clock In: <span>{new Date(log.clockInTime).toLocaleString()}</span></p>
                                                    <p>Clock Out: <span>{log.clockOutTime ? new Date(log.clockOutTime).toLocaleString() : 'N/A'}</span></p>
                                                    <p className="text-xs text-gray-500">Note: {log.clockInNote || 'No note'}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default withAuth(ManagerDashboard, 'manager');
