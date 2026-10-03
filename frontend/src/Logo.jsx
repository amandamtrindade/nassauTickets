export default function Logo() {
  return (
    <span className="logo" aria-label="NassauTickets">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M6 10h36a2 2 0 0 1 2 2v7a5 5 0 0 0 0 10v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a5 5 0 0 0 0-10v-7a2 2 0 0 1 2-2z" fill="#16a34a" />
        <path d="M13 31V17l12 14V17" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 14v20" stroke="#fff" strokeOpacity=".7" strokeWidth="2" strokeDasharray="3 3" />
      </svg>
      <span className="logo-texto"><b>Nassau</b>Tickets</span>
    </span>
  );
}