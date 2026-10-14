async function testImage() {
  const url = 'https://image.tmdb.org/t/p/original/78lPtwv72eTNqFW9COBYI0dWDJa.jpg';
  const res = await fetch(url);
  console.log('Status:', res.status, 'Content-Type:', res.headers.get('content-type'), 'Content-Length:', res.headers.get('content-length'));
}
testImage().catch(console.error);
