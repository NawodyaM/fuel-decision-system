import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Processing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const formData = location.state?.formData;
    if (!formData) { navigate('/', { replace: true }); return; }
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 15000);
    const run = async () => {
      try {
        const { weeklyAllocation, ...inputs } = formData;
        const payload = Object.fromEntries(Object.entries(inputs).map(([key, value]) => [key, Number(value)]));
        const base = (process.env.REACT_APP_API_URL || 'http://localhost:8000').replace(/\/$/, '');
        const response = await fetch(`${base}/predict`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload), signal: controller.signal
        });
        const data = await response.json();
        if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Please check the entered values.');
        const range = data.fuel_range;
        if (data.period !== 'weekly' || !range || typeof range.label !== 'string' || !Number.isFinite(range.lower_litres) || range.lower_litres < 0 || !(range.upper_litres === null || (Number.isFinite(range.upper_litres) && range.upper_litres >= range.lower_litres))) {
          throw new Error('The server returned an invalid fuel estimate.');
        }
        if (!controller.signal.aborted) navigate('/result', { state: { estimate: data, formData } });
      } catch (error) {
        if (controller.signal.aborted && !timedOut) return;
        alert(timedOut ? 'The prediction request timed out. Please try again.' : `Prediction failed: ${error.message}`);
        navigate('/', { replace: true });
      } finally { clearTimeout(timer); }
    };
    run();
    return () => { clearTimeout(timer); controller.abort(); };
  }, [navigate, location]);
  return <div className="processing-card" style={{ padding: 40 }}><h2>Processing Your Request</h2><p>Estimating your weekly fuel consumption range...</p></div>;
};
export default Processing;
