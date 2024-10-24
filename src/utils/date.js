export function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  // Trả về theo định dạng "dd/mm/yyyy"
  return `${day}/${month}/${year}`;
}
