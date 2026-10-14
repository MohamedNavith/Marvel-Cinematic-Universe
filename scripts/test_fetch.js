async function test() {
  try {
    const res = await fetch('https://www.themoviedb.org/movie/24428', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Length:', text.length);
    const ogs = [...text.matchAll(/<meta property="og:image" content="([^"]+)"/g)].map(m => m[1]);
    console.log('OG images:', ogs);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}
test();
