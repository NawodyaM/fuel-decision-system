import React from 'react';
import { useNavigate } from 'react-router-dom';

const FuelTips = () => {
  const navigate = useNavigate();

  const tips = [
    {
      title: "Smooth Acceleration",
      desc: "Hard acceleration burns up to 40% more fuel. Gradually build speed and anticipate traffic ahead to avoid sudden braking. Treat the accelerator like an egg under your foot.",
      sinhala: "වේගයෙන් ඇක්සලරේටරය ඔබන විට 40%ක් දක්වා වැඩිපුර ඉන්ධන වැය විය හැකිය. සෙමින් වේගය වැඩි කර ඉදිරි රථවාහන තත්ත්වය කලින් නිරීක්ෂණය කිරීමෙන් හදිසි තිරිංග යෙදීම වළක්වා ගත හැකිය. ඇක්සලරේටරය ඉතා මෘදු ලෙස භාවිතා කරන්න.",
      saving: "Save up to 40%",
      image: "/images/fuel-tips/smooth-acceleration.png",
      imageAlt: "A car travelling smoothly along a quiet road"
    },
    {
      title: "Tyre Pressure Check",
      desc: "Under-inflated tyres increase rolling resistance. Check your tyre pressure every 2 weeks — proper inflation improves fuel economy by 3–10% and extends tyre life.",
      sinhala: "සුළඟ අඩු ටයර් නිසා වාහනය ගමන් කිරීමට වැඩි ශක්තියක් අවශ්‍ය වේ. සති දෙකකට වරක් ටයර් පීඩනය පරීක්ෂා කරන්න. නිවැරදි පීඩනය පවත්වා ගැනීමෙන් ඉන්ධන ඉතිරි වන අතර ටයර්වල ආයු කාලයද වැඩි වේ.",
      saving: "Save up to 10%",
      image: "/images/fuel-tips/tyre-pressure.png",
      imageAlt: "Checking a car tyre with a pressure gauge"
    },
    {
      title: "AC vs Windows",
      desc: "Below 50 km/h, open your windows instead of using AC — it saves fuel. Above 80 km/h, open windows create drag and the AC becomes more efficient. Know the switch point!",
      sinhala: "50 km/h ට අඩු වේගයෙන් ගමන් කරන විට AC වෙනුවට ජනෙල් විවෘත කිරීමෙන් ඉන්ධන ඉතිරි කළ හැකිය. 80 km/h ට වැඩි වේගයේදී ජනෙල් විවෘතව තිබීමෙන් වායු ප්‍රතිරෝධය වැඩි වන බැවින් AC භාවිතය වඩාත් කාර්යක්ෂම වේ.",
      saving: "Save up to 8%",
      image: "/images/fuel-tips/ac-windows.png",
      imageAlt: "Car air conditioning vents and side window"
    },
    {
      title: "Regular Engine Tune-Up",
      desc: "A dirty air filter, worn spark plugs, or old engine oil forces your engine to work harder. Regular servicing can recover up to 4–12% in fuel efficiency.",
      sinhala: "අපිරිසිදු වායු පෙරහනක්, පැරණි ස්පාර්ක් ප්ලග් හෝ පැරණි එන්ජින් තෙල් නිසා එන්ජිමට වැඩිපුර වැඩ කිරීමට සිදු වේ. නිතිපතා සේවා කිරීමෙන් ඉන්ධන කාර්යක්ෂමතාව වැඩි කර ගත හැකිය.",
      saving: "Save up to 12%",
      image: "/images/fuel-tips/engine-service.png",
      imageAlt: "A mechanic checking an engine under an open bonnet"
    },
    {
      title: "Turn Off When Idle",
      desc: "Idling for more than 60 seconds uses more fuel than restarting. Turn off your engine at long railway crossings, school pickups, and traffic jams longer than 1 minute.",
      sinhala: "තත්පර 60කට වඩා එන්ජිම ක්‍රියාත්මකව නවතා තැබීම නැවත ආරම්භ කරනවාට වඩා වැඩි ඉන්ධන වැය කරයි. දිගු දුම්රිය හරස් මාර්ග, පාසල් අසල හෝ දිගු වාහන තදබදයකදී එන්ජිම නිවා දමන්න.",
      saving: "Save up to 5%",
      image: "/images/fuel-tips/engine-off.png",
      imageAlt: "Switching off a parked car engine"
    },
    {
      title: "Remove Excess Weight",
      desc: "Every extra 50 kg in your vehicle reduces fuel economy by 1–2%. Clean out your boot — those bags of cement, tools, and heavy items you 'meant to unload' are costing you money.",
      sinhala: "වාහනයේ අමතර කිලෝග්‍රෑම් 50ක් තිබෙන සෑම අවස්ථාවකදීම ඉන්ධන කාර්යක්ෂමතාව 1–2%කින් අඩු වේ. අනවශ්‍ය බර සහිත භාණ්ඩ ඉවත් කිරීමෙන් ඉන්ධන ඉතිරි කර ගත හැකිය.",
      saving: "Save up to 2%",
      image: "/images/fuel-tips/lighten-load.png",
      imageAlt: "Removing luggage from a car boot"
    },
    {
      title: "Plan Your Route",
      desc: "Combining multiple short trips into a single errand prevents cold starts, which burn extra fuel. Use GPS navigation apps to avoid traffic jams and road construction.",
      sinhala: "කෙටි ගමන් කිහිපයක් එකම ගමනක් ලෙස සම්බන්ධ කර ගැනීමෙන් එන්ජිම සීතල වීමේදී වැඩිපුර ඉන්ධන දවීම වළක්වා ගත හැකිය. වාහන තදබද මඟහරවා ගැනීමට GPS සිතියම් භාවිතා කරන්න.",
      saving: "Save up to 10%",
      image: "/images/fuel-tips/plan-route.png",
      imageAlt: "A navigation map for planning a journey"
    },
    {
      title: "Check Fuel Cap",
      desc: "A loose, damaged, or missing fuel cap allows gasoline to evaporate into the air. Ensure your fuel cap is tightly closed after every refuel to prevent waste.",
      sinhala: "නිසි පරිදි වසා නොමැති හෝ හානි වූ ඉන්ධන තොප්පියක් (Fuel cap) නිසා ඉන්ධන වාෂ්ප වී යා හැක. සෑම විටම ඉන්ධන පිරවීමෙන් පසු තොප්පිය තදින් වසා ඇති බව තහවුරු කරගන්න.",
      saving: "Save up to 2%",
      image: "/images/fuel-tips/fuel-cap.png",
      imageAlt: "Closing a car fuel cap securely"
    },
    {
      title: "Avoid Speeding",
      desc: "Most vehicles have an optimal fuel economy speed between 60 to 90 km/h. Driving above 100 km/h significantly increases aerodynamic drag and burns fuel much faster.",
      sinhala: "බොහෝ වාහනවල හොඳම ඉන්ධන කාර්යක්ෂමතාව ලැබෙන්නේ 60ත් 90ත් අතර වේගයකදීය. 100 km/h ට වඩා වැඩි වේගයෙන් ධාවනය කිරීමේදී වායු ප්‍රතිරෝධය වැඩි වී වේගයෙන් ඉන්ධන දවයි.",
      saving: "Save up to 15%",
      image: "/images/fuel-tips/steady-speed.png",
      imageAlt: "Steady driving on an open road"
    },
    {
      title: "Use Cruise Control",
      desc: "On open highways, using cruise control helps maintain a steady, uniform speed, preventing minor unintended accelerations that waste fuel.",
      sinhala: "විවෘත මහාමාර්ගවල ගමන් කිරීමේදී කෲස් පාලක (Cruise Control) භාවිත කිරීමෙන් නියත වේගයක් පවත්වා ගනිමින් ඉන්ධන අපතේ යාම වළක්වා ගත හැකිය.",
      saving: "Save up to 7%",
      image: "/images/fuel-tips/cruise-control.png",
      imageAlt: "Steering wheel cruise control on an open road"
    }
  ];

  return (
    <div className="tips-page" style={containerStyle}>
      <div className="tips-header" style={headerStyle}>
        <h1 style={titleStyle}>TOP FUEL SAVING TIPS / ඉන්ධන ඉතිරි කිරීමේ උපදෙස්</h1>
        <p style={subtitleStyle}>Small changes in how you drive and maintain your vehicle can save thousands of rupees each month.</p>
      </div>

      <div className="tips-grid" style={gridStyle}>
        {tips.map((tip, index) => (
          <div className="tip-card" key={index} style={cardStyle}>
            <img className="tip-image" src={`${process.env.PUBLIC_URL || ''}${tip.image}`} alt={tip.imageAlt} width="1536" height="1024" loading="lazy" decoding="async" />
            <h3 style={cardTitleStyle}>{tip.title}</h3>
            
            {/* English Description */}
            <p style={cardDescStyle}>{tip.desc}</p>
            
            {/* Sinhala Description */}
            <p style={sinhalaDescStyle}>{tip.sinhala}</p>

            <div className="tip-badge" style={badgeStyle}>{tip.saving}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button onClick={() => navigate('/')} style={buttonStyle}>Back to Dashboard</button>
      </div>
    </div>
  );
};

// Styles (Responsive සහ Layout පාලනය සකස් කර ඇත)
const containerStyle = {
  padding: '30px 20px',
  backgroundColor: '#F9F1E7',
  minHeight: '100vh',
  fontFamily: "'Times New Roman', Times, serif",
  boxSizing: 'border-box',
  width: '100%',
  overflowX: 'hidden'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '40px'
};

const titleStyle = {
  color: '#1b3b36',
  fontSize: '28px',
  fontWeight: '800',
  marginBottom: '10px',
  letterSpacing: '1px',
  fontFamily: "'Times New Roman', Times, serif"
};

const subtitleStyle = {
  color: '#555',
  fontSize: '15px',
  fontFamily: "'Times New Roman', Times, serif"
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '25px',
  maxWidth: '1200px',
  margin: '0 auto',
  boxSizing: 'border-box'
};

const cardStyle = {
  backgroundColor: '#e8d2ea',
  color: '#ffffff',
  padding: '25px',
  borderRadius: '16px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  border: '1px solid #e8d2ea',
  boxSizing: 'border-box',
  fontFamily: "'Times New Roman', Times, serif",
  wordBreak: 'break-word'
};

const cardTitleStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '12px',
  color: '#000000',
  fontFamily: "'Times New Roman', Times, serif"
};

const cardDescStyle = {
  fontSize: '14px',
  color: '#555454',
  lineHeight: '1.6',
  marginBottom: '12px',
  flexGrow: 1,
  fontWeight: '600',
  fontFamily: "'Times New Roman', Times, serif"
};

const sinhalaDescStyle = {
  fontSize: '13px',
  color: '#3A6D73', 
  lineHeight: '1.5',
  marginBottom: '20px',
  fontStyle: 'italic',
  fontWeight: '550',
  fontFamily: "'Times New Roman', Times, serif"
};

const badgeStyle = {
  display: 'inline-block',
  backgroundColor: '#1b3b36',
  color: '#7ac9e4',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: '600',
  alignSelf: 'flex-start',
  border: '1px solid #7ac9e4',
  fontFamily: "'Times New Roman', Times, serif"
};

const buttonStyle = {
  padding: '12px 30px',
  backgroundColor: '#3A6D73',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600',
  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
  fontFamily: "'Times New Roman', Times, serif"
};

export default FuelTips;
