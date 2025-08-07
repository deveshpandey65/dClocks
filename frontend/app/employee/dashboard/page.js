'use client';
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import withAuth from '@/hoc/withAuth';
import api from '@/utils/api';
import { signOut } from '@/services/signOut'


const EmployeeDashboard = () => {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dailyLogs, setDailyLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const getCoords = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation is not supported by your browser"));
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => resolve(position.coords),
                    (error) => reject(error),
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            }
        });
    };

    const handleAction = async (type) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const coords = await getCoords();
            await api.post(`/worker/${type}`, {
                note,
                latitude: coords.latitude,
                longitude: coords.longitude
            });
            setMessage({
                type: 'success',
                text: `${type === 'clock-in' ? 'Clocked in' : 'Clocked out'} successfully!`
            });
            setNote('');
            fetchLogsForDate(selectedDate);
        } catch (err) {
            const errorMessage = err?.response?.data?.message || 'Action failed due to a network or geolocation error.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const fetchLogsForDate = async (date) => {
        setLogsLoading(true);
        try {
            const res = await api.post('/worker/getDetails', { date });
            setDailyLogs(res.data);
        } catch (err) {
            console.error('Failed to fetch logs:', err);
            setMessage({ type: 'error', text: 'Failed to fetch logs for this date.' });
        } finally {
            setLogsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogsForDate(selectedDate);
    }, [selectedDate]);

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
    const days = [];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const startDay = firstDayOfMonth(currentMonth, currentYear);

    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    for (let i = 1; i <= totalDays; i++) {
        const dayDate = new Date(currentYear, currentMonth, i);
        const isSelected = dayDate.toDateString() === selectedDate.toDateString();
        const isToday = dayDate.toDateString() === new Date().toDateString();
        days.push(
            <div
                key={i}
                onClick={() => setSelectedDate(dayDate)}
                className={`flex items-center justify-center h-10 w-10 text-center font-medium rounded-full cursor-pointer
                    ${isToday ? 'bg-indigo-200 text-indigo-800 dark:bg-indigo-700 dark:text-white' : ''}
                    ${isSelected ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}
                `}
            >
                {i}
            </div>
        );
    }

    const changeMonth = (direction) => {
        const newDate = new Date(currentYear, currentMonth + direction, 1);
        setCurrentMonth(newDate.getMonth());
        setCurrentYear(newDate.getFullYear());
        setSelectedDate(newDate);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans p-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 text-center">Your Dashboard</h1>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
                <button
                    onClick={signOut}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
                    <div className="flex flex-col items-center mb-6 text-center">
                        <Clock size={48} className="text-indigo-500 dark:text-indigo-400 mb-3 animate-pulse" />
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Manage Shift</h2>
                        <p className="text-gray-500 dark:text-gray-400">Clock in or out and add a note.</p>
                    </div>

                    {message.text && (
                        <div className={`flex items-center gap-2 p-4 mb-6 rounded-lg font-medium text-left w-full ${message.type === 'success'
                            ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                            : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
                            }`}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                            {message.text}
                        </div>
                    )}

                    <div className="mb-6 w-full">
                        <label htmlFor="note-textarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Optional Note</label>
                        <textarea
                            id="note-textarea"
                            rows="2"
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 transition-colors resize-none"
                            placeholder="Add an optional note about your shift..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col space-y-4 w-full">
                        <button
                            onClick={() => handleAction('clock-in')}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg disabled:bg-green-400 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Clocking In...' : 'Clock In'}
                        </button>
                        <br/>
                        <button
                            onClick={() => handleAction('clock-out')}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg disabled:bg-red-400 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Clocking Out...' : 'Clock Out'}
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                    <div className="flex flex-col items-center mb-6 text-center">
                        <Calendar size={48} className="text-indigo-500 dark:text-indigo-400 mb-3" />
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Your Logs</h2>
                        <p className="text-gray-500 dark:text-gray-400">Select a date to view your logs.</p>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <ChevronLeft size={20} />
                        </button>
                        <h3 className="text-lg font-bold">
                            {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-sm text-center mb-6">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-gray-500 dark:text-gray-400 font-semibold">{day}</div>
                        ))}
                        {days}
                    </div>

                    <h4 className="text-lg font-bold mb-4 border-t pt-4 border-gray-200 dark:border-gray-700">
                        Logs for {selectedDate.toDateString()}
                    </h4>

                    {logsLoading ? (
                        <div className="flex justify-center items-center py-4">
                            <Loader className="animate-spin text-indigo-500" />
                        </div>
                    ) : dailyLogs.length > 0 ? (
                        <ul className="space-y-4">
                            {dailyLogs.map(log => (
                                <li key={log._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p><strong>Clock In:</strong> {new Date(log.clockInTime).toLocaleString()}</p>
                                    <p><strong>Clock Out:</strong> {log.clockOutTime ? new Date(log.clockOutTime).toLocaleString() : 'N/A'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">Note: {log.note || 'No note'}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No logs found for this date.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withAuth(EmployeeDashboard, ['employee']);
