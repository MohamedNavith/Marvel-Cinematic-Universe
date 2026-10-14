async function checkRecords() {
  const res = await fetch('https://raw.githubusercontent.com/ThatGuySam/marvelorder/main/src/json/mcu-timeline-sheet.json');
  const sheet = await res.json();
  console.log('Records count:', sheet.records?.length);
  console.log('Sample record:', sheet.records?.[0]);
  process.exit(0);
}
checkRecords().catch(err => { console.error(err); process.exit(1); });
