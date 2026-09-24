import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ResultStatusIllustration, { statusPresentation } from './ResultStatusIllustration';

export function allocationStatus(range, allocation) {
  if (allocation < range.lower_litres || (range.upper_litres === null && allocation <= range.lower_litres)) return 'Below estimated requirement';
  if (range.upper_litres !== null && allocation >= range.upper_litres) return 'Covers estimated range';
  return 'Uncertain - allocation falls within the estimated range';
}

const recommendations = {
  'Covers estimated range': [
    ['Follow your planned weekly journeys while checking actual fuel use throughout the week.', 'සතිය සඳහා සැලසුම් කළ ගමන් සිදු කරන අතරතුර සැබෑ ඉන්ධන භාවිතය පරීක්ෂා කරන්න.'],
    ['Keep some fuel available for unexpected or essential extra journeys.', 'අනපේක්ෂිත හෝ අත්‍යවශ්‍ය අමතර ගමන් සඳහා ඉන්ධන කොටසක් ඉතිරි කර තබා ගන්න.'],
    ['Combine errands and avoid unnecessary extra trips to preserve your remaining fuel.', 'ඉතිරි ඉන්ධන රැක ගැනීමට වැඩ කිහිපයක් එකම ගමනකදී කර ගන්න සහ අනවශ්‍ය අමතර ගමන් අවම කරන්න.'],
    ['Record weekly distance and fuel use to check whether your allocation continues to meet your needs.', 'වෙන් කළ ඉන්ධන දිගටම ප්‍රමාණවත්දැයි බැලීමට සතිපතා ගමන් දුර සහ ඉන්ධන භාවිතය සටහන් කරන්න.'],
  ],
  'Below estimated requirement': [
    ['Prioritize essential journeys and postpone nonessential trips to reduce weekly fuel needs.', 'සතිපතා ඉන්ධන අවශ්‍යතාව අඩු කිරීමට අත්‍යවශ්‍ය ගමන්වලට ප්‍රමුඛතාව දෙන්න සහ අත්‍යවශ්‍ය නොවන ගමන් කල් දමන්න.'],
    ['Combine several errands into one trip and plan routes with less unnecessary driving.', 'වැඩ කිහිපයක් එකම ගමනකදී කර ගැනීමටත් අනවශ්‍ය ගමන් දුර අඩු කිරීමටත් මාර්ග සැලසුම් කරන්න.'],
    ['Use public transport or share a ride where practical for some of your weekly journeys.', 'හැකි අවස්ථාවලදී සතියේ සමහර ගමන් සඳහා පොදු ප්‍රවාහනය හෝ වෙනත් අය සමඟ හවුලේ ගමන් කිරීම තෝරා ගන්න.'],
    ['Before essential travel, check the fuel in your tank and arrange additional fuel if available, or an alternative way to travel.', 'අත්‍යවශ්‍ය ගමනකට පෙර ටැංකියේ ඉන්ධන පරීක්ෂා කර, ලබා ගත හැකි නම් අමතර ඉන්ධන හෝ වෙනත් ගමන් ක්‍රමයක් සූදානම් කර ගන්න.'],
  ],
  'Uncertain - allocation falls within the estimated range': [
    ['Fuel sufficiency is uncertain; check your actual fuel use before committing to all planned journeys.', 'ඉන්ධන ප්‍රමාණවත් බව නිශ්චිත නැත. සැලසුම් කළ සියලු ගමන් සිදු කිරීමට තීරණය කිරීමට පෙර සැබෑ ඉන්ධන භාවිතය පරීක්ෂා කරන්න.'],
    ['Prioritize essential journeys and combine errands until you know how much fuel remains.', 'ඉතිරි ඉන්ධන ප්‍රමාණය තහවුරු කර ගන්නා තුරු අත්‍යවශ්‍ය ගමන්වලට ප්‍රමුඛතාව දෙන්න සහ වැඩ කිහිපයක් එකම ගමනකදී කර ගන්න.'],
    ['Check the fuel level during the week and adjust your remaining travel plans if consumption is higher than expected.', 'සතිය අතරතුර ඉන්ධන මට්ටම පරීක්ෂා කරන්න. බලාපොරොත්තු වූවාට වඩා පරිභෝජනය වැඩි නම් ඉතිරි ගමන් සැලසුම් වෙනස් කරන්න.'],
    ['Prepare an alternative travel option or arrange additional fuel if available in case your allocation runs short.', 'වෙන් කළ ඉන්ධන මදි වුවහොත් භාවිත කිරීමට වෙනත් ගමන් ක්‍රමයක් හෝ ලබා ගත හැකි නම් අමතර ඉන්ධන සූදානම් කර ගන්න.'],
  ],
};

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef();
  const [downloading, setDownloading] = useState(false);
  const [generatedAt] = useState(() => new Date().toLocaleString());
  const { estimate, formData } = state || {};
  const range = estimate?.fuel_range;
  const allocation = Number(formData?.weeklyAllocation);
  const valid = estimate?.period === 'weekly' && range && typeof range.label === 'string' && Number.isFinite(range.lower_litres) && range.lower_litres >= 0 && (range.upper_litres === null || (Number.isFinite(range.upper_litres) && range.upper_litres >= range.lower_litres)) && formData?.weeklyAllocation !== '' && formData?.weeklyAllocation != null && Number.isFinite(allocation) && allocation >= 0;

  const download = async () => {
    setDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth() - 20;
      const availableHeight = pdf.internal.pageSize.getHeight() - 20;
      const pixelsPerPage = Math.max(1, Math.floor(availableHeight * canvas.width / width));
      for (let top = 0; top < canvas.height; top += pixelsPerPage) {
        if (top > 0) pdf.addPage();
        const page = document.createElement('canvas');
        page.width = canvas.width;
        page.height = Math.min(pixelsPerPage, canvas.height - top);
        page.getContext('2d').drawImage(canvas, 0, top, canvas.width, page.height, 0, 0, canvas.width, page.height);
        pdf.addImage(page.toDataURL('image/png'), 'PNG', 10, 10, width, page.height * width / page.width);
      }
      pdf.save('Fuel_Prediction_Report.pdf');
    } catch (error) { alert('Failed to download report. Please try again.'); }
    finally { setDownloading(false); }
  };

  if (!valid) return <div className="result-empty" style={card}><h2>No valid prediction available</h2><p lang="si" className="result-si">වලංගු පුරෝකථනයක් නොමැත.</p><p>Enter your weekly driving information to generate a result.<span lang="si" className="result-si">ප්‍රතිඵලයක් ලබා ගැනීමට ඔබගේ සතිපතා ගමන් තොරතුරු ඇතුළත් කරන්න.</span></p><button onClick={() => navigate('/')}>Back to Dashboard / නැවත මුල් පිටුවට</button></div>;
  const status = allocationStatus(range, allocation);
  const presentation = statusPresentation[status];
  const balanceMessages = [];
  const maximumRemaining = allocation - range.lower_litres;
  if (range.upper_litres === null) {
    if (maximumRemaining <= 0) {
      balanceMessages.push([
        `You may need more than ${(-maximumRemaining).toFixed(2)} L of extra fuel.`,
        `අමතර ඉන්ධන ලීටර් ${(-maximumRemaining).toFixed(2)}කට වඩා අවශ්‍ය විය හැක.`,
      ]);
    } else {
      balanceMessages.push([
        `Less than ${maximumRemaining.toFixed(2)} L may remain, or you may need extra fuel.`,
        `ලීටර් ${maximumRemaining.toFixed(2)}කට අඩු ප්‍රමාණයක් ඉතිරි විය හැක, නැතහොත් අමතර ඉන්ධන අවශ්‍ය විය හැක.`,
      ]);
    }
    balanceMessages.push([
      'The predicted consumption has no upper limit, so the maximum extra fuel needed cannot be estimated.',
      'පුරෝකථනය කළ පරිභෝජනයට උපරිම සීමාවක් නැති නිසා අවශ්‍ය විය හැකි උපරිම අමතර ඉන්ධන ප්‍රමාණය ගණනය කළ නොහැක.',
    ]);
  } else {
    const minimumRemaining = allocation - range.upper_litres;
    if (minimumRemaining >= 0) {
      balanceMessages.push([
        `${minimumRemaining.toFixed(2)} to ${maximumRemaining.toFixed(2)} L may remain at the end of the week.`,
        `සතිය අවසානයේ ඉන්ධන ලීටර් ${minimumRemaining.toFixed(2)} සිට ${maximumRemaining.toFixed(2)} දක්වා ඉතිරි විය හැක.`,
      ]);
    } else if (maximumRemaining <= 0) {
      balanceMessages.push([
        `You may need ${(-maximumRemaining).toFixed(2)} to ${(-minimumRemaining).toFixed(2)} L of extra fuel for the week.`,
        `සතිය සඳහා අමතර ඉන්ධන ලීටර් ${(-maximumRemaining).toFixed(2)} සිට ${(-minimumRemaining).toFixed(2)} දක්වා අවශ්‍ය විය හැක.`,
      ]);
    } else {
      balanceMessages.push([
        `If fuel use is higher, you may need up to ${(-minimumRemaining).toFixed(2)} L of extra fuel.`,
        `ඉන්ධන වැඩියෙන් වැය වුණොත් ලීටර් ${(-minimumRemaining).toFixed(2)}ක් දක්වා අමතරව අවශ්‍ය විය හැක.`,
      ], [
        `If fuel use is lower, up to ${maximumRemaining.toFixed(2)} L may remain.`,
        `ඉන්ධන අඩුවෙන් වැය වුණොත් ලීටර් ${maximumRemaining.toFixed(2)}ක් දක්වා ඉතිරි විය හැක.`,
      ], [
        'It is uncertain whether your allocation will last the week.',
        'වෙන් කළ ඉන්ධන සතියට ප්‍රමාණවත් වේද යන්න නිශ්චිත නැත.',
      ]);
    }
  }
  return <div className="result-page" style={{ padding: 30, background: '#F9F1E7', minHeight: '100vh' }}>
    <div className="result-card" ref={reportRef} style={card}>
      <h2>Weekly Fuel Prediction<span lang="si" className="result-si">සතිපතා ඉන්ධන පරිභෝජන පුරෝකථනය</span></h2>
      <p>Report generated / වාර්තාව සකස් කළ වේලාව: {generatedAt}</p>
      <div className="result-summary">
        <section className="result-stat result-primary" style={stat}><h3>Estimated weekly consumption<span lang="si" className="result-si">ඇස්තමේන්තුගත සතිපතා ඉන්ධන පරිභෝජනය</span></h3><strong>{range.label}</strong><span lang="si" className="result-si">{range.label.replace('Less than ', '').replace('More than ', '').replace(' L', '')}{range.label.startsWith('Less than') ? ' ලීටර්වලට අඩු' : range.label.startsWith('More than') ? ' ලීටර්වලට වැඩි' : ' ලීටර්'}</span></section>
        <section className="result-stat" style={stat}><h3>Weekly allocation<span lang="si" className="result-si">සතිය සඳහා වෙන් කළ ඉන්ධන ප්‍රමාණය</span></h3><strong>{allocation.toFixed(2)} L</strong><span lang="si" className="result-si">L = ලීටර්</span></section>
        <section className="result-stat" style={stat}>
          <h3>Fuel at the end of the week<span lang="si" className="result-si">සතිය අවසානයේ ඉන්ධන තත්ත්වය</span></h3>
          {balanceMessages.map(([english, sinhala]) => <p key={english}>{english}<span lang="si" className="result-si">{sinhala}</span></p>)}
        </section>
      </div>
      <section className="result-status-banner" data-tone={presentation.tone}>
        <ResultStatusIllustration presentation={presentation} />
        <div><h3>Status: {status}</h3><p lang="si" className="result-si">{presentation.sinhala}</p><p lang="si" className="result-si">{presentation.description}</p><p>This compares your allocation with the predicted category. Actual consumption may fall outside this category.<span lang="si" className="result-si">මෙහි වෙන් කළ ඉන්ධන ප්‍රමාණය පුරෝකථනය කළ පරාසය සමඟ සසඳයි. සැබෑ පරිභෝජනය මෙම පරාසයෙන් පිටත විය හැකිය.</span></p></div>
      </section>
      {(Array.isArray(estimate.warnings) ? estimate.warnings : []).filter(item => typeof item === 'string').map((warning, index) => <p key={index}>{warning}<span lang="si" className="result-si">{warning === "This is an estimated weekly survey category, not an exact fuel measurement or a guarantee of sufficient fuel." ? 'මෙය සමීක්ෂණ දත්ත මත පදනම් වූ සතිපතා ඇස්තමේන්තුවකි. නිශ්චිත ඉන්ධන මිනුමක් හෝ ඉන්ධන ප්‍රමාණවත් බවට සහතිකයක් නොවේ.' : warning === "Distance is outside the model's training range; this estimate may be unreliable." ? 'ඇතුළත් කළ දුර ආකෘතිය පුහුණු කළ දත්තවල දුර පරාසයෙන් පිටත ඇත. එබැවින් මෙම ඇස්තමේන්තුවේ විශ්වසනීයත්වය අඩු විය හැකිය.' : ''}</span></p>)}
      <h3 className="result-recommendations-title">Recommendations / නිර්දේශ</h3>
      <ul>
        {recommendations[status].map(([english, sinhala]) => <React.Fragment key={english}>
          <li>{english}</li>
          <li lang="si">{sinhala}</li>
        </React.Fragment>)}
      </ul>
    </div>
    <div className="result-actions" style={{ display: 'flex', gap: 16, marginTop: 20 }}>
      <button onClick={() => navigate('/')}>Back to Dashboard / නැවත මුල් පිටුවට</button>
      <button onClick={download} disabled={downloading}>{downloading ? 'Generating report... / වාර්තාව සකස් වෙමින් පවතී...' : 'Download Report (PDF) / වාර්තාව බාගත කරන්න'}</button>
    </div>
  </div>;
};
const card = { background: '#F3E9DD', padding: 30, borderRadius: 20, maxWidth: 1000, margin: 'auto', color: '#1b3b36', fontFamily: "'Times New Roman', Times, serif" };
const stat = { background: '#fff', padding: 20, borderRadius: 12, marginBottom: 16 };
export default Result;
