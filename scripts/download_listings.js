const fs = require('fs');

async function mapTmdbPaths() {
  const res = await fetch('https://raw.githubusercontent.com/ThatGuySam/marvelorder/main/src/json/listings.json');
  const listings = await res.json();
  console.log('Listings loaded:', listings.length);
  
  // Save locally for quick access
  fs.writeFileSync('scripts/listings.json', JSON.stringify(listings, null, 2));
  console.log('Saved scripts/listings.json');
}

mapTmdbPaths().catch(console.error);
