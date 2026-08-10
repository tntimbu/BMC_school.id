export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) {
    alert('Tidak ada data untuk diekspor');
    return;
  }

  const keys = Object.keys(rows[0]);
  const header = keys.join(',');
  const csvRows = rows.map(row => {
    return keys
      .map(key => {
        const val = row[key] === null || row[key] === undefined ? '' : row[key];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(',');
  });

  const csvContent = [header, ...csvRows].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
