const fs = require('fs');

async function downloadMcuApi() {
  const [movies, tvshows, chars, postCredit] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/gh/AugustoMarcelo/mcuapi@master/data/movies.json').then(r => r.json()),
    fetch('https://cdn.jsdelivr.net/gh/AugustoMarcelo/mcuapi@master/data/tvshows.json').then(r => r.json()),
    fetch('https://cdn.jsdelivr.net/gh/AugustoMarcelo/mcuapi@master/data/characters.json').then(r => r.json()),
    fetch('https://cdn.jsdelivr.net/gh/AugustoMarcelo/mcuapi@master/data/post-credit-scenes.json').then(r => r.json())
  ]);

  fs.writeFileSync('scripts/mcu_movies.json', JSON.stringify(movies, null, 2));
  fs.writeFileSync('scripts/mcu_tvshows.json', JSON.stringify(tvshows, null, 2));
  fs.writeFileSync('scripts/mcu_characters.json', JSON.stringify(chars, null, 2));
  fs.writeFileSync('scripts/mcu_post_credits.json', JSON.stringify(postCredit, null, 2));
  console.log('Saved mcu_movies.json, mcu_tvshows.json, mcu_characters.json, mcu_post_credits.json');
}

downloadMcuApi().catch(console.error);
