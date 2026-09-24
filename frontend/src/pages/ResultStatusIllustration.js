import React from 'react';

// Display metadata only: the existing allocationStatus function decides the status.
export const statusPresentation = {
  'Covers estimated range': {
    tone: 'covered', color: '#28744d', background: '#dcecd2',
    sinhala: 'වෙන් කළ ඉන්ධන ප්‍රමාණය ඇස්තමේන්තුගත පරාසයට ප්‍රමාණවත්ය.',
    description: 'මෙය ඇස්තමේන්තුවකි. සැබෑ ඉන්ධන පරිභෝජනය වෙනස් විය හැකි බැවින් ප්‍රමාණවත් බවට සහතිකයක් නොවේ.',
  },
  'Below estimated requirement': {
    tone: 'below', color: '#aa4c31', background: '#f7dfd3',
    sinhala: 'වෙන් කළ ඉන්ධන ප්‍රමාණය ඇස්තමේන්තුගත අවශ්‍යතාවට වඩා අඩුය.',
    description: 'ගමන් කිරීමට පෙර ඇති ඉන්ධන ප්‍රමාණය නැවත පරීක්ෂා කර ගමන් සැලැස්ම සලකා බලන්න.',
  },
  'Uncertain - allocation falls within the estimated range': {
    tone: 'uncertain', color: '#927017', background: '#f4e8bf',
    sinhala: 'වෙන් කළ ඉන්ධන ප්‍රමාණය ප්‍රමාණවත්ද යන්න නිශ්චිත නැත.',
    description: 'ඇස්තමේන්තුගත පරාසය අනුව ඉන්ධන ප්‍රමාණවත් වීමට හෝ හිඟ වීමට හැකිය. සැබෑ පරිභෝජනය නිරීක්ෂණය කරන්න.',
  },
};

export default function ResultStatusIllustration({ presentation }) {
  const { tone, color, background, sinhala } = presentation;
  return <svg viewBox="0 0 120 120" role="img" aria-label={sinhala}>
    <circle cx="60" cy="60" r="57" fill={background} />
    <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="28" y="25" width="42" height="65" rx="7" fill="#fff" />
      <rect x="36" y="34" width="26" height="20" rx="3" />
      <path d="M25 92h49M70 49h7c5 0 7 4 7 9v13c0 9 12 9 12 0V44L85 32M87 35v12h9" />
      <path d="M37 66h22M37 76h15" />
    </g>
    <circle cx="88" cy="89" r="23" fill={color} stroke="#fff" strokeWidth="3" />
    {tone === 'covered'
      ? <path d="m77 89 8 8 14-16" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      : tone === 'below'
        ? <path d="M78 89h20" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        : <g fill="#fff"><path d="M85 76h6l-1 17h-4z" /><circle cx="88" cy="100" r="3" /></g>}
  </svg>;
}
