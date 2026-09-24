import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormDraft } from '../FormContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      return localStorage.getItem('fuel-dashboard-welcome-dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  const dismissWelcome = () => {
    setShowWelcome(false);
    try {
      localStorage.setItem('fuel-dashboard-welcome-dismissed', 'true');
    } catch {
      // The form remains usable when browser storage is unavailable.
    }
  };
  const { formData, setFormData, resetForm } = useFormDraft();

  const [submitted, setSubmitted] = useState(false);
  const missing = name => submitted && formData[name] === "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(previous => ({ ...previous, [name]: value }));
  };

  const handlePredict = () => {
    setSubmitted(true);
    // Check if all 12 inputs are filled
    const isComplete = Object.values(formData).every(value => value !== '' && value !== null && value !== undefined);

    if (!isComplete) {
      const firstMissing = Object.keys(formData).find(name => formData[name] === '');
      document.getElementsByName(firstMissing)[0]?.focus();
      return;
    }

    const distance = Number(formData.IV_Distance_KM);
    const allocation = Number(formData.weeklyAllocation);
    if (!Number.isFinite(distance) || distance <= 0 || !Number.isFinite(allocation) || allocation < 0) {
      alert('Enter a weekly distance greater than zero and a non-negative fuel allocation.');
      return;
    }
    navigate('/processing', { state: { formData } });
  };

  return (
    <div className="dashboard-page" style={pageContainer}>
      <div className="dashboard-card" style={formCard}>
        <h2 style={titleStyle}>Dashboard / ඩෑෂ්බෝඩ්</h2>
        <p>Enter the total distance you travel in a week, in kilometres. The model estimates a weekly fuel range, not exact litres.</p>
        {showWelcome && (
          <section className="dashboard-welcome" aria-labelledby="welcome-title">
            <h3 id="welcome-title">Estimate your weekly fuel needs / සතිපතා ඉන්ධන අවශ්‍යතාව ඇස්තමේන්තු කරන්න</h3>
            <p>Enter your vehicle and driving details to get a weekly fuel range. New here? The Input Guide explains each field.</p>
            <p lang="si">ඔබේ වාහනය සහ රිය පැදවීමේ තොරතුරු ඇතුළත් කරන්න. Inputs පුරවන ආකාරය දැනගන්න Input Guide එක බලන්න.</p>
            <div className="dashboard-welcome-actions">
              <Link to="/input-guide">View Input Guide / Input Guide බලන්න</Link>
              <button type="button" onClick={dismissWelcome}>Let's get started / හරි, පටන් ගමු</button>
            </div>
          </section>
        )}
        <p className="dashboard-guide-link">
          <Link to="/input-guide">How do I fill in the inputs? / Inputs පුරවන්නේ කොහොමද?</Link>
        </p>
        {submitted && (formData.IV_Distance_KM === '' || formData.weeklyAllocation === '') && <p className="field-error" role="alert">Please enter your weekly distance and fuel allocation.</p>}
        <button type="button" className="dashboard-clear" onClick={() => { resetForm(); setSubmitted(false); }}>Clear Form / පෝරමය හිස් කරන්න</button>
        <div className="dashboard-fields" style={gridContainer}>
          {/* 1. Vehicle Type */}
          <div title="Select the category of your vehicle (e.g., Car, Van, Bus, Lorry, SUV).">
            <label style={labelStyle}>Vehicle Type / වාහනයේ වර්ගය</label>
            <select name="IV_Vehicle_Type" aria-invalid={missing('IV_Vehicle_Type')} aria-describedby={missing('IV_Vehicle_Type') ? 'IV_Vehicle_Type-error' : undefined} value={formData.IV_Vehicle_Type} onChange={handleChange} style={inputStyle}>
              <option value="" disabled>Select... / {"\u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1"}...</option>
              <option value="1">Car / මෝටර් රථය</option>
              <option value="2">Bus / බස් රථය</option>
              <option value="3">Van / වෑන් රථය</option>
              <option value="4">Three-wheeler / ත්‍රිරෝද රථය</option>
              <option value="5">Motorcycle / මෝටර් බයිසිකලය</option>
              <option value="6">Lorry / ලොරි රථය</option>
            </select>
            {missing('IV_Vehicle_Type') && <p className="field-error" id="IV_Vehicle_Type-error" role="alert">Please select an option. / {"\u0d9a\u0dbb\u0dd4\u0dab\u0dcf\u0d9a\u0dbb \u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1."}</p>}
          </div>
          {/* 2. Fuel Type */}
          <div title="Choose the type of fuel your vehicle uses, primarily Petrol or Diesel.">
            <label style={labelStyle}>Fuel Type / ඉන්ධන වර්ගය</label>
            <select name="IV_Fuel_Type" aria-invalid={missing('IV_Fuel_Type')} aria-describedby={missing('IV_Fuel_Type') ? 'IV_Fuel_Type-error' : undefined} value={formData.IV_Fuel_Type} onChange={handleChange} style={inputStyle}>
              <option value="" disabled>Select... / {"\u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1"}...</option>
              <option value="1">Petrol / පෙට්‍රල්</option>
              <option value="2">Diesel / ඩීසල්</option>
            </select>
            {missing('IV_Fuel_Type') && <p className="field-error" id="IV_Fuel_Type-error" role="alert">Please select an option. / {"\u0d9a\u0dbb\u0dd4\u0dab\u0dcf\u0d9a\u0dbb \u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1."}</p>}
          </div>
          {/* 3. Driving Style */}
          <div title="Select how aggressively or smoothly you typically drive.">
            <label style={labelStyle}>Driving Style / රිය පැදවීමේ විලාසය</label>
            <select name="IV_Driving_Style" aria-invalid={missing('IV_Driving_Style')} aria-describedby={missing('IV_Driving_Style') ? 'IV_Driving_Style-error' : undefined} value={formData.IV_Driving_Style} onChange={handleChange} style={inputStyle}>
              <option value="" disabled>Select... / {"\u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1"}...</option>
              <option value="1">Smooth / සුමට</option>
              <option value="2">Moderate / මධ්‍යස්ථ</option>
              <option value="3">Aggressive / ආක්‍රමණශීලී (වේගවත්)</option>
            </select>
            {missing('IV_Driving_Style') && <p className="field-error" id="IV_Driving_Style-error" role="alert">Please select an option. / {"\u0d9a\u0dbb\u0dd4\u0dab\u0dcf\u0d9a\u0dbb \u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1."}</p>}
          </div>
          {/* 4. Speed */}
          <div title="Indicate your typical cruising speed range on the journey.">
            <label style={labelStyle}>Average Speed / සාමාන්‍ය වේගය</label>
            <select name="IV_Average_Speed" aria-invalid={missing('IV_Average_Speed')} aria-describedby={missing('IV_Average_Speed') ? 'IV_Average_Speed-error' : undefined} value={formData.IV_Average_Speed} onChange={handleChange} style={inputStyle}>
              <option value="" disabled>Select... / {"\u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1"}...</option>
              <option value="1">Below 40 / 40 ට අඩු</option>
              <option value="2">40-60 km/h</option>
              <option value="3">60-80 km/h</option>
              <option value="4">80-100 km/h </option>
              <option value="5">Above 100 km/h</option>
            </select>
            {missing('IV_Average_Speed') && <p className="field-error" id="IV_Average_Speed-error" role="alert">Please select an option. / {"\u0d9a\u0dbb\u0dd4\u0dab\u0dcf\u0d9a\u0dbb \u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1."}</p>}
          </div>
          {/* 5. Traffic Type */}
          <div title="Choose the general traffic condition of your usual routes.">
            <label style={labelStyle}>Traffic Type / රථවාහන තත්ත්වය</label>
            <select name="IV_Traffic_Type" aria-invalid={missing('IV_Traffic_Type')} aria-describedby={missing('IV_Traffic_Type') ? 'IV_Traffic_Type-error' : undefined} value={formData.IV_Traffic_Type} onChange={handleChange} style={inputStyle}>
              <option value="" disabled>Select... / {"\u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1"}...</option>
              <option value="1">Low / අඩු</option>
              <option value="2">Moderate / මධ්‍යම</option>
              <option value="3">Heavy / අධික</option>
            </select>
            {missing('IV_Traffic_Type') && <p className="field-error" id="IV_Traffic_Type-error" role="alert">Please select an option. / {"\u0d9a\u0dbb\u0dd4\u0dab\u0dcf\u0d9a\u0dbb \u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1."}</p>}
          </div>
          {/* 6. Fuel Rating */}
          <div title="Indicates the overall efficiency category or condition rating of your vehicle's fuel system.">
            <label style={labelStyle}>Fuel Rating / ඉන්ධන ශ්‍රේණිගත කිරීම</label>
            <select name="IV_Fuel_Consumption_Rating" aria-invalid={missing('IV_Fuel_Consumption_Rating')} aria-describedby={missing('IV_Fuel_Consumption_Rating') ? 'IV_Fuel_Consumption_Rating-error' : undefined} value={formData.IV_Fuel_Consumption_Rating} onChange={handleChange} style={inputStyle}>
              <option value="" disabled>Select... / {"\u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1"}...</option>
              <option value="1">Low / අඩු</option>
              <option value="2">Medium / මධ්‍යම</option>
              <option value="3">High / වැඩි</option>
            </select>
            {missing('IV_Fuel_Consumption_Rating') && <p className="field-error" id="IV_Fuel_Consumption_Rating-error" role="alert">Please select an option. / {"\u0d9a\u0dbb\u0dd4\u0dab\u0dcf\u0d9a\u0dbb \u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1."}</p>}
          </div>
          {/* 7. Quick Acceleration */}
          <div title="How often do you rapidly press the accelerator?">
            <label style={labelStyle}>Quick Acceleration / ඉක්මන් ඇක්සලරේටර් භාවිතය</label>
            <select name="IV_Quick_Acceleration" aria-invalid={missing('IV_Quick_Acceleration')} aria-describedby={missing('IV_Quick_Acceleration') ? 'IV_Quick_Acceleration-error' : undefined} value={formData.IV_Quick_Acceleration} onChange={handleChange} style={inputStyle}>
              <option value="" disabled>Select... / {"\u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1"}...</option>
              <option value="0">Never / කවදාවත් නැත</option>
              <option value="1">Sometimes / සමහර විට</option>
              <option value="2">Often / නිතර</option>
            </select>
            {missing('IV_Quick_Acceleration') && <p className="field-error" id="IV_Quick_Acceleration-error" role="alert">Please select an option. / {"\u0d9a\u0dbb\u0dd4\u0dab\u0dcf\u0d9a\u0dbb \u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1."}</p>}
          </div>
          {/* 8. Sudden Brakes */}
          <div title="How frequently do you apply harsh or sudden braking during your drive?">
            <label style={labelStyle}>Sudden Brakes / හදිසි තිරිංග භාවිතය</label>
            <select name="IV_Sudden_Brakes" aria-invalid={missing('IV_Sudden_Brakes')} aria-describedby={missing('IV_Sudden_Brakes') ? 'IV_Sudden_Brakes-error' : undefined} value={formData.IV_Sudden_Brakes} onChange={handleChange} style={inputStyle}>
              <option value="" disabled>Select... / {"\u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1"}...</option>
              <option value="0">Never / කවදාවත් නැත</option>
              <option value="1">Sometimes / සමහර විට</option>
              <option value="2">Often / නිතර</option>
            </select>
            {missing('IV_Sudden_Brakes') && <p className="field-error" id="IV_Sudden_Brakes-error" role="alert">Please select an option. / {"\u0d9a\u0dbb\u0dd4\u0dab\u0dcf\u0d9a\u0dbb \u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1."}</p>}
          </div>
          {/* 9. Traffic Congestion */}
          <div title="How often do you encounter traffic congestion on your usual journeys?">
            <label style={labelStyle}>Traffic Congestion Frequency / වාහන තදබදයට මුහුණ දෙන වාර ගණන</label>
            <select name="IV_Traffic_Congestion" aria-invalid={missing('IV_Traffic_Congestion')} aria-describedby={missing('IV_Traffic_Congestion') ? 'IV_Traffic_Congestion-error' : undefined} value={formData.IV_Traffic_Congestion} onChange={handleChange} style={inputStyle}>
              <option value="" disabled>Select... / {"\u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1"}...</option>
              <option value="1">Rarely / කලාතුරකින්</option>
              <option value="2">Sometimes / සමහර විට</option>
              <option value="3">Frequently / නිතර</option>
            </select>
            {missing('IV_Traffic_Congestion') && <p className="field-error" id="IV_Traffic_Congestion-error" role="alert">Please select an option. / {"\u0d9a\u0dbb\u0dd4\u0dab\u0dcf\u0d9a\u0dbb \u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1."}</p>}
          </div>
          {/* 10. Stop and Go */}
          <div title="Indicates whether your route involves frequent stopping and starting.">
            <label style={labelStyle}>Stop-and-Go / නිතර නතර කර ගමන් කිරීම</label>
            <select name="IV_Stop_and_Go" aria-invalid={missing('IV_Stop_and_Go')} aria-describedby={missing('IV_Stop_and_Go') ? 'IV_Stop_and_Go-error' : undefined} value={formData.IV_Stop_and_Go} onChange={handleChange} style={inputStyle}>
              <option value="" disabled>Select... / {"\u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1"}...</option>
              <option value="0">No / නැත</option>
              <option value="1">Yes / ඔව්</option>
            </select>
            {missing('IV_Stop_and_Go') && <p className="field-error" id="IV_Stop_and_Go-error" role="alert">Please select an option. / {"\u0d9a\u0dbb\u0dd4\u0dab\u0dcf\u0d9a\u0dbb \u0dad\u0ddd\u0dbb\u0db1\u0dca\u0db1."}</p>}
          </div>
          {/* 11. Distance */}
          <div title="The total distance you plan to travel within the week in kilometers.">
            <label style={labelStyle}>Total weekly distance (km) / ගමන් කරන දුර (කි.මී.)</label>
            <input name="IV_Distance_KM" type="number" min="0.01" step="any" value={formData.IV_Distance_KM} onChange={handleChange} style={inputStyle} placeholder="Enter km / කිලෝමීටර්වලින් ඇතුළත් කරන්න" />
          </div>
          {/* 12. Weekly Fuel Allocation */}
          <div title="Your total allocated weekly fuel quota in liters provided by the system/government.">
            <label style={labelStyle}>Weekly Fuel Allocation (L) / සතිපතා ඉන්ධන ප්‍රමාණය (ලීටර්)</label>
            <input 
              name="weeklyAllocation" min="0" step="any" 
              type="number" 
              value={formData.weeklyAllocation} 
              onChange={handleChange} 
              style={inputStyle} 
              placeholder="Enter your weekly limit / සතිපතා ඉන්ධන සීමාව ඇතුළත් කරන්න"
            />
          </div>
        </div>
        <button onClick={handlePredict} style={buttonStyle}>Predict Fuel Usage / ඉන්ධන පරිභෝජනය පුරෝකථනය කරන්න</button>
      </div>
    </div>
  );
};

// Styles
const pageContainer = { 
  padding: '20px', 
  minHeight: '100vh', 
  backgroundColor: '#F9F1E7',
  fontFamily: "'Times New Roman', Times, serif"
};

const titleStyle = {
  color: '#1b3b36',
  fontSize: '32px',
  fontWeight: '800',
  marginBottom: '10px',
  letterSpacing: '1px'
};

const formCard = { backgroundColor: '#F0E6D8', padding: '40px', borderRadius: '20px', border: '1px solid #DED0C1', maxWidth: '800px', margin: 'auto' };
const gridContainer = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #DED0C1', backgroundColor: '#fff', fontFamily: "'Times New Roman', Times, serif" };
const buttonStyle = { marginTop: '20px', padding: '12px 30px', backgroundColor: '#3A6D73', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', width: '100%', fontFamily: "'Times New Roman', Times, serif", fontSize: '14px' };

export default Dashboard;
