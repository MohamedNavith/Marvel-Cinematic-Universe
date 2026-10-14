async function testMediaList() {
  const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/media-list/Iron_Man_(2008_film)');
  const data = await res.json();
  console.log('Items count:', data.items?.length);
  const images = (data.items || []).filter(item => item.type === 'image');
  console.log('Images sample:', images.slice(0, 5).map(img => ({ title: img.title, url: img.srcset?.[0]?.src })));
  process.exit(0);
}
testMediaList().catch(err => { console.error(err); process.exit(1); });
