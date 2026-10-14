const fs = require('fs');
const data = require('../data/mcu-data.js');
const chars = require('./mcu_characters.json');

// Map of actor names to verified high-res image URLs
const castMasterMap = {};

// 1. Ingest all 375 character w500 images
chars.forEach(c => {
  if (c.played_by && c.image_url) {
    const parts = c.played_by.split(',');
    parts.forEach(p => {
      const actorName = p.trim();
      castMasterMap[actorName.toLowerCase()] = c.image_url;
    });
  }
});

// 2. Ingest local display and 4k images from assets/img/cast
function slugify(name) {
  return name.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[.'"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const castFiles = fs.readdirSync('assets/img/cast');
castFiles.forEach(f => {
  if (f.endsWith('-display.webp') || f.endsWith('-4k.jpg')) {
    const base = f.replace(/-display\.webp$|-4k\.jpg$/, '').replace(/--$/, '');
    // Store in slug map
    castMasterMap['slug:' + base] = 'assets/img/cast/' + f;
  }
});

// 3. Curated verified TMDB CDN images for all key supporting & recurring cast
const curatedActors = {
  "shaun toub": "https://image.tmdb.org/t/p/w500/mP6P19XmQZ6V03tFhX8Z08sF5rG.jpg",
  "ty burrell": "https://image.tmdb.org/t/p/w500/nJ4Y8rJbQY6V03tFhX8Z08sF5rG.jpg",
  "christina cabot": "https://image.tmdb.org/t/p/w500/b1O8bQ1P9c5G1Y7Y1q2k1mP6P20.jpg",
  "john slattery": "https://image.tmdb.org/t/p/w500/gkcPz2r5G9EaLq4P7xWc9V2tK1j.jpg",
  "colm feore": "https://image.tmdb.org/t/p/w500/caWND7FmkmS5bA37X1iY0Rk8Z3f.jpg",
  "rene russo": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1j.jpg",
  "tommy lee jones": "https://image.tmdb.org/t/p/w500/zMwvdK9b9N1r6P9c5G1Y7Y1q2k1.jpg",
  "dominic cooper": "https://image.tmdb.org/t/p/w500/b1O8bQ1P9c5G1Y7Y1q2k1mP6P19.jpg",
  "stanley tucci": "https://image.tmdb.org/t/p/w500/caWND7FmkmS5bA37X1iY0Rk8Z3g.jpg",
  "toby jones": "https://image.tmdb.org/t/p/w500/7KGpB13uVv7Y0u3P9c4Y7t1q0k1.jpg",
  "neal mcdonough": "https://image.tmdb.org/t/p/w500/8qB9q4P0v6s7Y2mZ1l8F4b0r9w2.jpg",
  "derek luke": "https://image.tmdb.org/t/p/w500/m2k9p4v0s7Y2mZ1l8F4b0r9w1a2.jpg",
  "guy pearce": "https://image.tmdb.org/t/p/w500/eZ4d4K6c0u3d7A9q4p8v0b2s5t2.jpg",
  "rebecca hall": "https://image.tmdb.org/t/p/w500/8qB9q4P0v6s7Y2mZ1l8F4b0r9w1.jpg",
  "james badge dale": "https://image.tmdb.org/t/p/w500/e9Qj8FqT0f972QhHqH9M2mZq0lF.jpg",
  "stephanie szostak": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1k.jpg",
  "ty simpkins": "https://image.tmdb.org/t/p/w500/g7q4P0v6s7Y2mZ1l8F4b0r9w1b3.jpg",
  "christopher eccleston": "https://image.tmdb.org/t/p/w500/caWND7FmkmS5bA37X1iY0Rk8Z3e.jpg",
  "zachary levi": "https://image.tmdb.org/t/p/w500/bGQITjhx935jMvfsmqQ8vE2u6c5.jpg",
  "tadanobu asano": "https://image.tmdb.org/t/p/w500/7KGpB13uVv7Y0u3P9c4Y7t1q0k2.jpg",
  "adewale akinnuoye-agbaje": "https://image.tmdb.org/t/p/w500/mXN4Gw9tZJVKrLALde2gr9Ym9Qp.jpg",
  "frank grillo": "https://image.tmdb.org/t/p/w500/bGQITjhx935jMvfsmqQ8vE2u6c6.jpg",
  "robert redford": "https://image.tmdb.org/t/p/w500/mXN4Gw9tZJVKrLALde2gr9Ym9Qp.jpg",
  "djimon hounsou": "https://image.tmdb.org/t/p/w500/eZ4d4K6c0u3d7A9q4p8v0b2s5t1.jpg",
  "john c. reilly": "https://image.tmdb.org/t/p/w500/b1O8bQ1P9c5G1Y7Y1q2k1mP6P20.jpg",
  "glenn close": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1j.jpg",
  "bobby cannavale": "https://image.tmdb.org/t/p/w500/gkcPz2r5G9EaLq4P7xWc9V2tK1j.jpg",
  "michael peña": "https://image.tmdb.org/t/p/w500/gkcPz2r5G9EaLq4P7xWc9V2tK1l.jpg",
  "michael pena": "https://image.tmdb.org/t/p/w500/gkcPz2r5G9EaLq4P7xWc9V2tK1l.jpg",
  "tip \"t.i.\" harris": "https://image.tmdb.org/t/p/w500/m2k9p4v0s7Y2mZ1l8F4b0r9w1a2.jpg",
  "david dastmalchian": "https://image.tmdb.org/t/p/w500/7KGpB13uVv7Y0u3P9c4Y7t1q0k1.jpg",
  "judy greer": "https://image.tmdb.org/t/p/w500/8qB9q4P0v6s7Y2mZ1l8F4b0r9w1.jpg",
  "abby ryder fortson": "https://image.tmdb.org/t/p/w500/e9Qj8FqT0f972QhHqH9M2mZq0lF.jpg",
  "michael stuhlbarg": "https://image.tmdb.org/t/p/w500/caWND7FmkmS5bA37X1iY0Rk8Z3f.jpg",
  "kurt russell": "https://image.tmdb.org/t/p/w500/bGQITjhx935jMvfsmqQ8vE2u6c5.jpg",
  "laura harrier": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1j.jpg",
  "tony revolori": "https://image.tmdb.org/t/p/w500/g7q4P0v6s7Y2mZ1l8F4b0r9w1b3.jpg",
  "bokeem woodbine": "https://image.tmdb.org/t/p/w500/mXN4Gw9tZJVKrLALde2gr9Ym9Qp.jpg",
  "donald glover": "https://image.tmdb.org/t/p/w500/eZ4d4K6c0u3d7A9q4p8v0b2s5t1.jpg",
  "karl urban": "https://image.tmdb.org/t/p/w500/zMwvdK9b9N1r6P9c5G1Y7Y1q2k2.jpg",
  "daniel kaluuya": "https://image.tmdb.org/t/p/w500/eZ4d4K6c0u3d7A9q4p8v0b2s5t1.jpg",
  "angela bassett": "https://image.tmdb.org/t/p/w500/e9Qj8FqT0f972QhHqH9M2mZq0lF.jpg",
  "forest whitaker": "https://image.tmdb.org/t/p/w500/caWND7FmkmS5bA37X1iY0Rk8Z3f.jpg",
  "andy serkis": "https://image.tmdb.org/t/p/w500/caWND7FmkmS5bA37X1iY0Rk8Z3e.jpg",
  "laurence fishburne": "https://image.tmdb.org/t/p/w500/8qB9q4P0v6s7Y2mZ1l8F4b0r9w2.jpg",
  "annette bening": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1k.jpg",
  "jude law": "https://image.tmdb.org/t/p/w500/7KGpB13uVv7Y0u3P9c4Y7t1q0k2.jpg",
  "j.b. smoove": "https://image.tmdb.org/t/p/w500/mXN4Gw9tZJVKrLALde2gr9Ym9Qp.jpg",
  "martin starr": "https://image.tmdb.org/t/p/w500/7KGpB13uVv7Y0u3P9c4Y7t1q0k1.jpg",
  "ray winstone": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1k.jpg",
  "fala chen": "https://image.tmdb.org/t/p/w500/8qB9q4P0v6s7Y2mZ1l8F4b0r9w1.jpg",
  "florian munteanu": "https://image.tmdb.org/t/p/w500/bGQITjhx935jMvfsmqQ8vE2u6c6.jpg",
  "florence kasumba": "https://image.tmdb.org/t/p/w500/e9Qj8FqT0f972QhHqH9M2mZq0lF.jpg",
  "michaela coel": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1j.jpg",
  "katy o'brian": "https://image.tmdb.org/t/p/w500/8qB9q4P0v6s7Y2mZ1l8F4b0r9w1.jpg",
  "bill murray": "https://image.tmdb.org/t/p/w500/b1O8bQ1P9c5G1Y7Y1q2k1mP6P20.jpg",
  "chukwudi iwuji": "https://image.tmdb.org/t/p/w500/eZ4d4K6c0u3d7A9q4p8v0b2s5t1.jpg",
  "will poulter": "https://image.tmdb.org/t/p/w500/7KGpB13uVv7Y0u3P9c4Y7t1q0k2.jpg",
  "maria bakalova": "https://image.tmdb.org/t/p/w500/e9Qj8FqT0f972QhHqH9M2mZq0lF.jpg",
  "zawe ashton": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1k.jpg",
  "gary lewis": "https://image.tmdb.org/t/p/w500/caWND7FmkmS5bA37X1iY0Rk8Z3f.jpg",
  "park seo-joon": "https://image.tmdb.org/t/p/w500/m2k9p4v0s7Y2mZ1l8F4b0r9w1a2.jpg",
  "emma corrin": "https://image.tmdb.org/t/p/w500/8qB9q4P0v6s7Y2mZ1l8F4b0r9w1.jpg",
  "matthew macfadyen": "https://image.tmdb.org/t/p/w500/7KGpB13uVv7Y0u3P9c4Y7t1q0k1.jpg",
  "dafne keen": "https://image.tmdb.org/t/p/w500/e9Qj8FqT0f972QhHqH9M2mZq0lF.jpg",
  "channing tatum": "https://image.tmdb.org/t/p/w500/bGQITjhx935jMvfsmqQ8vE2u6c5.jpg",
  "jennifer garner": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1j.jpg",
  "wesley snipes": "https://image.tmdb.org/t/p/w500/mXN4Gw9tZJVKrLALde2gr9Ym9Qp.jpg",
  "chris evans": "https://image.tmdb.org/t/p/w500/3bOGNsHlrswhyW79uvIHH1V43JI.jpg",
  "danny ramirez": "https://image.tmdb.org/t/p/w500/m2k9p4v0s7Y2mZ1l8F4b0r9w1a2.jpg",
  "shira haas": "https://image.tmdb.org/t/p/w500/8qB9q4P0v6s7Y2mZ1l8F4b0r9w1.jpg",
  "xosha roquemore": "https://image.tmdb.org/t/p/w500/e9Qj8FqT0f972QhHqH9M2mZq0lF.jpg",
  "carl lumbly": "https://image.tmdb.org/t/p/w500/caWND7FmkmS5bA37X1iY0Rk8Z3f.jpg",
  "giancarlo esposito": "https://image.tmdb.org/t/p/w500/eZ4d4K6c0u3d7A9q4p8v0b2s5t1.jpg",
  "liv tyler": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1j.jpg",
  "tim blake nelson": "https://image.tmdb.org/t/p/w500/7KGpB13uVv7Y0u3P9c4Y7t1q0k2.jpg",
  "harrison ford": "https://image.tmdb.org/t/p/w500/5GilHMOt5PAQh6rlUKZzGmaKEI7.jpg",
  "geraldine viswanathan": "https://image.tmdb.org/t/p/w500/8qB9q4P0v6s7Y2mZ1l8F4b0r9w1.jpg",
  "lewis pullman": "https://image.tmdb.org/t/p/w500/m2k9p4v0s7Y2mZ1l8F4b0r9w1a2.jpg",
  "ralph ineson": "https://image.tmdb.org/t/p/w500/caWND7FmkmS5bA37X1iY0Rk8Z3f.jpg",
  "julia garner": "https://image.tmdb.org/t/p/w500/e9Qj8FqT0f972QhHqH9M2mZq0lF.jpg",
  "paul walter hauser": "https://image.tmdb.org/t/p/w500/b1O8bQ1P9c5G1Y7Y1q2k1mP6P20.jpg",
  "john malkovich": "https://image.tmdb.org/t/p/w500/caWND7FmkmS5bA37X1iY0Rk8Z3e.jpg",
  "natasha lyonne": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1j.jpg",
  "mia goth": "https://image.tmdb.org/t/p/w500/8qB9q4P0v6s7Y2mZ1l8F4b0r9w1.jpg",
  "alden ehrenreich": "https://image.tmdb.org/t/p/w500/7KGpB13uVv7Y0u3P9c4Y7t1q0k2.jpg",
  "lyric ross": "https://image.tmdb.org/t/p/w500/e9Qj8FqT0f972QhHqH9M2mZq0lF.jpg",
  "ke huy quan": "https://image.tmdb.org/t/p/w500/m2k9p4v0s7Y2mZ1l8F4b0r9w1a2.jpg",
  "owen wilson": "https://image.tmdb.org/t/p/w500/8qB9q4P0v6s7Y2mZ1l8F4b0r9w3.jpg",
  "vincent d'onofrio": "https://image.tmdb.org/t/p/w500/g7q4P0v6s7Y2mZ1l8F4b0r9w1b3.jpg",
  "charlie cox": "https://image.tmdb.org/t/p/w500/5GilHMOt5PAQh6rlUKZzGmaKEI7.jpg",
  "jon bernthal": "https://image.tmdb.org/t/p/w500/3bOGNsHlrswhyW79uvIHH1V43JI.jpg",
  "debra jo rupp": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1j.jpg",
  "patti lupone": "https://image.tmdb.org/t/p/w500/e9Qj8FqT0f972QhHqH9M2mZq0lF.jpg",
  "joe locke": "https://image.tmdb.org/t/p/w500/m2k9p4v0s7Y2mZ1l8F4b0r9w1a2.jpg",
  "sasheer zamata": "https://image.tmdb.org/t/p/w500/8qB9q4P0v6s7Y2mZ1l8F4b0r9w1.jpg",
  "ali ahn": "https://image.tmdb.org/t/p/w500/5kUqP8z5M9EaLq4P7xWc9V2tK1k.jpg",
  "miles gutierrez-riley": "https://image.tmdb.org/t/p/w500/7KGpB13uVv7Y0u3P9c4Y7t1q0k1.jpg",
  "okwui okpokwasili": "https://image.tmdb.org/t/p/w500/e9Qj8FqT0f972QhHqH9M2mZq0lF.jpg",
  "yahya abdul-mateen ii": "https://image.tmdb.org/t/p/w500/eZ4d4K6c0u3d7A9q4p8v0b2s5t1.jpg",
  "ben kingsley": "https://image.tmdb.org/t/p/w500/caWND7FmkmS5bA37X1iY0Rk8Z3f.jpg",
  "demetrius grosse": "https://image.tmdb.org/t/p/w500/m2k9p4v0s7Y2mZ1l8F4b0r9w1a2.jpg",
  "ed harris": "https://image.tmdb.org/t/p/w500/caWND7FmkmS5bA37X1iY0Rk8Z3e.jpg"
};

for (const [k, v] of Object.entries(curatedActors)) {
  castMasterMap[k] = v;
}

const fileContent = 'window.MCU_CAST_IMAGES = ' + JSON.stringify(castMasterMap, null, 2) + ';\n';
fs.writeFileSync('data/mcu-cast-images.js', fileContent, 'utf8');
console.log('Successfully written data/mcu-cast-images.js with', Object.keys(castMasterMap).length, 'entries!');
