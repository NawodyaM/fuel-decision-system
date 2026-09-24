import React from 'react';
import { useNavigate } from 'react-router-dom';

const InputGuide = () => {
  const navigate = useNavigate();

  const inputsInfo = [
    {
        name: "1. Vehicle Type",
        desc: "Select your vehicle category: Car, Bus, Van, Three-wheeler, Motorcycle, or Lorry. Different vehicles have different base fuel consumption rates.",
        sinhala: "ඔබගේ වාහනයේ වර්ගය තෝරන්න: මෝටර් රථය, බස් රථය, වෑන් රථය, ත්‍රිරෝද රථය, මෝටර් බයිසිකලය හෝ ලොරි රථය. සෑම වාහන වර්ගයකටම වෙනස් මූලික ඉන්ධන පරිභෝජන අගයක් ඇත.",
        image: "/images/input-guide/vehicle-types.png"
    },
    {
        name: "2. Fuel Type",
        desc: "Choose the type of fuel your vehicle uses, primarily Petrol or Diesel.",
        sinhala: "ඔබගේ වාහනය භාවිතා කරන ඉන්ධන වර්ගය තෝරන්න (පෙට්‍රල් හෝ ඩීසල්).",
        image: "/images/input-guide/fuel-types.png"
    },
    {
        name: "3. Driving Style",
        desc: "Select how aggressively or smoothly you typically drive (e.g., Smooth, Moderate, Aggressive).",
        sinhala: "සාමාන්‍යයෙන් ඔබ රිය පදවන ආකාරය තෝරන්න (සුමට, මධ්‍යස්ථ, හෝ වේගවත්/ආක්‍රමණශීලී).",
        image: "/images/input-guide/driving-style.png"
    },
    {
        name: "4. Average Speed",
        desc: "Select your usual driving speed range: Below 40 km/h, 40-60 km/h, 60-80 km/h, 80-100 km/h, or Above 100 km/h.",
        sinhala: "ඔබගේ සාමාන්‍ය ගමන් වේග පරාසය තෝරන්න: 40 km/h ට අඩු, 40–60 km/h, 60–80 km/h, 80–100 km/h හෝ 100 km/h ට වැඩි.",
        image: "/images/input-guide/average-speed.png"
    },
    {
        name: "5. Traffic Type",
        desc: "Choose the general traffic condition of your usual routes (e.g., Low, Medium, Heavy).",
        sinhala: "ඔබ සාමාන්‍යයෙන් ගමන් කරන මාර්ගවල රථවාහන තත්ත්වය තෝරන්න (අඩු, මධ්‍යම, හෝ අධික).",
        image: "/images/input-guide/traffic-type.png"
    },
    {
        name: "6. Fuel Rating",
        desc: "Indicates the overall efficiency category or condition rating of your vehicle's fuel system.",
        sinhala: "ඔබගේ වාහනයේ ඉන්ධන පද්ධතියේ කාර්යක්ෂමතාව හෝ තත්ත්වය පෙන්වන ශ්‍රේණිගත කිරීම.",
        image: "/images/input-guide/fuel-rating.png"
    },
    {
        name: "7. Quick Acceleration",
        desc: "How often do you rapidly press the accelerator? (e.g., Never, Sometimes, Frequently).",
        sinhala: "ඔබ ඉක්මනින් ඇක්සලරේටරය ඔබන වාර ගණන තෝරන්න (කවදාවත් නැහැ, සමහර විට, නිතර).",
        image: "/images/input-guide/quick-acceleration.png"
    },
    {
        name: "8. Sudden Brakes",
        desc: "How frequently do you apply harsh or sudden braking during your drive? (e.g., Never, Sometimes, Frequently).",
        sinhala: "ඔබ හදිසි තිරිංග යොදන වාර ගණන තෝරන්න (කවදාවත් නැහැ, සමහර විට, නිතර).",
        image: "/images/input-guide/sudden-brakes.png"
    },
    {
        name: "9. Traffic Congestion Frequency",
        desc: "How often do you encounter traffic congestion on your usual journeys? Choose Rarely, Sometimes, or Frequently.",
        sinhala: "ඔබ සාමාන්‍යයෙන් ගමන් කරන විට වාහන තදබදයට මුහුණ දෙන්නේ කොපමණ වාරයක්ද? කලාතුරකින්, සමහර විට හෝ නිතර යන්න තෝරන්න.",
        image: "/images/input-guide/congestion-frequency.png"
    },
    {
        name: "10. Stop-and-Go",
        desc: "Indicates whether your route involves frequent stopping and starting (Yes/No).",
        sinhala: "ඔබගේ මාර්ගයේ නිතර නතර වී නැවත ගමන් කිරීම සිදුවේද? (ඔව් / නැහැ)",
        image: "/images/input-guide/stop-and-go.png"
    },
    {
        name: "11. Distance (km)",
        desc: "The total distance you plan to travel within the week in kilometers.",
        sinhala: "ඔබ සතියක් තුළ ගමන් කිරීමට සැලසුම් කරන මුළු දුර (කිලෝමීටර් වලින්).",
        image: "/images/input-guide/weekly-distance.png"
    },
    {
        name: "12. Weekly Fuel Allocation (L)",
        desc: "Your total allocated weekly fuel quota in liters provided by the system/government.",
        sinhala: "රජය හෝ පද්ධතිය මඟින් ඔබට සතියකට ලබා දෙන මුළු ඉන්ධන ප්‍රමාණය (ලීටර් වලින්).",
        image: "/images/input-guide/weekly-allocation-qr.png"
    }
    ];

  return (
    <div className="guide-page" style={containerStyle}>
      <div className="guide-panel" style={cardStyle}>
        <h2 style={titleStyle}>Guide to Dashboard Inputs / ආදාන මාර්ගෝපදේශය</h2>
        <p style={{ color: '#666', fontSize: '15px', marginBottom: '25px' }}>
          Understand what each input parameter means before filling out your dashboard form. / ඩෑෂ්බෝඩ් පෝරමය පිරවීමට පෙර එක් එක් දත්තයෙන් අදහස් වන්නේ කුමක්දැයි වටහා ගන්න.
        </p>

        <div className="guide-grid" style={gridStyle}>
          {inputsInfo.map((item, index) => (
            <div className="guide-card" key={index} style={itemCardStyle}>
              {item.image && (
                <div style={{ textAlign: 'center', marginBottom: '10px', backgroundColor: '#fff',borderRadius: '6px', padding: '5px' }}>
                  <img 
                    src={`${process.env.PUBLIC_URL || ''}${item.image}`} 
                    alt={item.name} 
                    style={{ width: '100%', height: '120px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #E5D5C5' }} 
                  />
                </div>
              )}
              <h4 style={{ color: '#000000', marginBottom: '6px', fontSize: '15px',fontWeight: '650' }}>{item.name}</h4>
              <p style={{ color: '#555454', fontSize: '14px', margin: '0 0 6px 0', lineHeight: '1.4', fontWeight: '600' }}>{item.desc}</p>
              <p style={{ color: '#3A6D73', fontSize: '13px', margin: 0, fontStyle: 'italic', lineHeight: '1.4', fontWeight: '550' }}> {item.sinhala}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={() => navigate('/')} style={buttonStyle}>
            Proceed to Dashboard ➔ ඩෑෂ්බෝඩ් වෙත යන්න
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '30px',
  backgroundColor: '#fff5ec',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: "'Times New Roman', Times, serif",
  boxSizing: 'border-box'
};

const cardStyle = {
  backgroundColor: '#F3E9DD',
  padding: '30px',
  borderRadius: '20px',
  maxWidth: '950px',
  width: '100%',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  border: '1px solid #E5D5C5',
  boxSizing: 'border-box'
};

const titleStyle = {
  color: '#1b3b36',
  fontSize: '32px',
  fontWeight: '800',
  marginBottom: '10px',
  letterSpacing: '1px'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '15px',
  textAlign: 'left'
};

const itemCardStyle = {
  backgroundColor: '#e8d2ea',
  padding: '15px 20px',
  borderRadius: '10px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
  border: '1px solid #EFE6DC'
};

const buttonStyle = {
  padding: '12px 30px',
  backgroundColor: '#3A6D73',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: '600'
};

export default InputGuide;
