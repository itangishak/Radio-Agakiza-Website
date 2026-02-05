export function formatKirundiDateFull(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const months = [
    'Nzero',      // January
    'Ruhuhuma',   // February
    'Ntwarante',  // March
    'Ndamukiza',  // April
    'Rusama',     // May
    'Ruheshi',    // June
    'Mukakaro',   // July
    'Myandagaro', // August
    'Nyakanga',   // September
    'Gitugutu',   // October
    'Munyonyo',   // November
    'Kigarama',   // December
  ];
  const day = d.getDate();
  const month = months[d.getMonth()] ?? '';
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatKirundiMonthDay(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const months = [
    'Nzero',
    'Ruhuhuma',
    'Ntwarante',
    'Ndamukiza',
    'Rusama',
    'Ruheshi',
    'Mukakaro',
    'Myandagaro',
    'Nyakanga',
    'Gitugutu',
    'Munyonyo',
    'Kigarama',
  ];
  const abbr = (months[d.getMonth()] ?? '').slice(0, 3);
  const day = d.getDate();
  return `${abbr} ${day}`;
}
