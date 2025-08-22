import { Participant, Winner } from '../types';

export const exportToCSV = (data: any[], filename: string, headers: string[]): void => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = getNestedValue(row, header);
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj) || '';
};

export const parseCSV = (csvText: string): Participant[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      return {
        id: `imported_${Date.now()}_${index}`,
        tokenNo: values[0] || '',
        name: values[1] || '',
        phone: values[2] || '',
        year: values[3] || new Date().getFullYear().toString()
      };
    })
    .filter(p => p.tokenNo && p.name);
};