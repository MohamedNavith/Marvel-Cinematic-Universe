const fs = require('fs');
const tmdbMapping = require('./tmdb_real_images.json');
const mcuData = require('../data/mcu-data.js');

const stillsData = {};

mcuData.forEach(item => {
  if (item.type === 'film' || item.type === 'teaser') {
    const list = [];
    const baseBackdrop = tmdbMapping[item.id] ? 'https://image.tmdb.org/t/p/w1280' + tmdbMapping[item.id].backdrop : null;
    const localDisplay = item.backdropAssets && item.backdropAssets.display ? item.backdropAssets.display : null;
    const local4k = item.backdropAssets && item.backdropAssets.original ? item.backdropAssets.original : null;
    
    // Primary Keyframe Still
    if (baseBackdrop) {
      list.push({
        url: baseBackdrop,
        title: 'Cinematic Climax / Key Sequence',
        caption: `Definitive high-resolution widescreen still from ${item.title}.`
      });
    }

    // Local 4K Widescreen Master Still
    if (local4k && local4k !== baseBackdrop) {
      list.push({
        url: local4k,
        title: 'Master Theatrical Frame',
        caption: `Full-fidelity theatrical production frame showcasing the visual scale of ${item.title}.`
      });
    } else if (localDisplay && localDisplay !== baseBackdrop) {
      list.push({
        url: localDisplay,
        title: 'Cinematic Visual Tone',
        caption: `Key theatrical frame and cinematography showcase from ${item.title}.`
      });
    }

    // Curated iconic scene still
    const curatedStill = (tmdbMapping[item.id] && tmdbMapping[item.id].poster) ? 
      'https://image.tmdb.org/t/p/w1280' + tmdbMapping[item.id].backdrop :
      'assets/img/sacred-timeline-citadel-clean.webp';
      
    list.push({
      url: (item.backdropAssets && item.backdropAssets.display) || baseBackdrop || curatedStill,
      title: 'Iconic Ensemble Sequence',
      caption: `Heroes assemble in the defining cinematic chapter of ${item.title}.`
    });

    stillsData[item.id] = list;
  }
});

const content = 'window.MCU_MOVIE_STILLS = ' + JSON.stringify(stillsData, null, 2) + ';\n';
fs.writeFileSync('data/mcu-movie-stills.js', content, 'utf8');
console.log('Successfully written data/mcu-movie-stills.js for', Object.keys(stillsData).length, 'films!');
