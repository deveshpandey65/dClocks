'use client';
import { useEffect, useState } from 'react';
import { Input, Button, message } from 'antd';
import api from '../../utils/api';
import withAuth from '../../hoc/withAuth';

export default withAuth(function AutoClockPage() {
    const [note, setNote] = useState('');

    useEffect(() => {
        navigator.geolocation.watchPosition(async pos => {
            const { latitude, longitude } = pos.coords;
            try {
                console.log('emmp')
                await api.post('/worker/clock-in', { note, latitude, longitude });
                message.success('Automatically clocked in');
            } catch {
                // ignore if already clocked in or outside
            }
        });
    }, []);

    return (
        <>
            <Input.TextArea placeholder="Optional note" rows={2} onChange={e => setNote(e.target.value)} />
            <Button style={{ marginTop: 12 }} onClick={() => handleAction('clock-out')}>Clock Out</Button>
        </>
    );
}, ['employee']);
