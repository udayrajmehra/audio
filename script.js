// Get all the Spotify and YouTube icons
const spotifyIcons = document.querySelectorAll('.spotify-icon');
const youtubeIcons = document.querySelectorAll('.youtube-icon');
const youtubeAlbumIcons = document.querySelectorAll('.youtube-album-icon');

// Function to handle Spotify icon click event
function handleSpotifyIconClick(event) {
event.preventDefault();
const songId = this.getAttribute('data-song');
const embedType = this.getAttribute('data-type');

// Remove existing embeds
const existingEmbeds = document.querySelectorAll('.embedBox');
existingEmbeds.forEach(embed => {
  embed.remove();
});

if (embedType === 'album') {
  const embedCode = `<iframe src="https://open.spotify.com/embed/album/${songId}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
  const songEntry = this.closest('.song-entry');
  const embedContainer = document.createElement('div');
  embedContainer.classList.add('embedBox');
  embedContainer.innerHTML = embedCode;
  songEntry.appendChild(embedContainer);
} else if (embedType === 'song') {
  const embedCode = `<iframe src="https://open.spotify.com/embed/track/${songId}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
  const songEntry = this.closest('.song-entry');
  const embedContainer = document.createElement('div');
  embedContainer.classList.add('embedBox');
  embedContainer.innerHTML = embedCode;
  songEntry.appendChild(embedContainer);
  }
}

// Function to handle YouTube icon click event
function handleYoutubeIconClick(event) {
  event.preventDefault();
  const videoId = this.getAttribute('data-video');
  const songEntry = this.closest('.song-entry');
  const embedContainers = document.querySelectorAll('.song-entry .embedBox');

  // Remove existing embeds from other song entries
  embedContainers.forEach(container => {
    if (container.closest('.song-entry') !== songEntry) {
      container.remove();
    }
  });

  const embedCode = `<iframe class="embedBox" width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  const embedContainersWithinEntry = songEntry.querySelectorAll('.embedBox');

  // Remove existing embeds within the current song entry
  embedContainersWithinEntry.forEach(container => {
    container.remove();
  });

  // Create a new embed container and append the embed code
  const newEmbedContainer = document.createElement('div');
  newEmbedContainer.innerHTML = embedCode;
  songEntry.appendChild(newEmbedContainer);
}

function handleYoutubeAlbumClick(event) {
  event.preventDefault();
  const playlistId = this.getAttribute('data-playlist');
  const songEntry = this.closest('.song-entry');
  const embedContainers = document.querySelectorAll('.song-entry .embedBox');

  // Remove existing embeds from other song entries
  embedContainers.forEach(container => {
    if (container.closest('.song-entry') !== songEntry) {
      container.remove();
    }
  });

  const embedCode = `<iframe class="embedBox" width="560" height="315" src="https://www.youtube.com/embed?listType=playlist&list=${playlistId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  const embedContainersWithinEntry = songEntry.querySelectorAll('.embedBox');

  // Remove existing embeds within the current song entry
  embedContainersWithinEntry.forEach(container => {
    container.remove();
  });

  // Create a new embed container and append the embed code
  const newEmbedContainer = document.createElement('div');
  newEmbedContainer.innerHTML = embedCode;
  songEntry.appendChild(newEmbedContainer);
}

// Attach click event listeners using event delegation to the parent element that exists on the page
document.addEventListener('click', function(event) {
    const target = event.target;
  
    // Check if the clicked element has the class 'spotify-icon'
    if (target.classList.contains('spotify-icon')) {
      event.preventDefault();
      handleSpotifyIconClick.call(target, event);
    }
  
    // Check if the clicked element has the class 'youtube-icon'
    if (target.classList.contains('youtube-icon')) {
      event.preventDefault();
      handleYoutubeIconClick.call(target, event);
    }
  
    // Check if the clicked element has the class 'youtube-album-icon'
    if (target.classList.contains('youtube-album-icon')) {
      event.preventDefault();
      handleYoutubeAlbumClick.call(target, event);
    }
  });

// CSV file shenanigans
const csvFilePath = 'resources/track-data.csv';
  Papa.parse(csvFilePath, {
    download: true,
    header: true,
    complete: handleCsvParseComplete   
  });

function handleCsvParseComplete(results) {
    const tracks = results.data;
    tracks.forEach(addTrackToWebsite);
}

function addTrackToWebsite(track) {
    const { trackName, metadata, spotifyURI, youtubeTrackID, sectionPlacement, order, recorded, mixed, mastered } = track;

    const sectionTable = document.querySelector(`table#${sectionPlacement.replace(' ', '-')}`);
    if (!sectionTable) return; // Skip track if section table not found

    const tbody = sectionTable.querySelector('tbody');
    if (!tbody) return; // Skip track if tbody not found

    const newRow = tbody.insertRow(order - 1);

    // Create and append the track entry cell
    const trackEntryCell = newRow.insertCell(0);
    trackEntryCell.innerHTML = `
        <div class="song-entry">
            <span>${trackName}</span>
            <div class="icon-container">
                ${metadata === 'album' ? `
                <a href="#" class="spotify-icon" data-song="${spotifyURI}" data-type="${metadata}">
                    <img src="resources/spotify-icon.png" alt="Spotify Icon">
                </a>
                <a href="#" class="youtube-album-icon" data-playlist="${youtubeTrackID}" data-type="${metadata}">
                    <img src="resources/youtube-icon.png" alt="YouTube Icon">
                </a>
                ` : (metadata === 'song' && spotifyURI !== 'null' ? `
                <a href="#" class="spotify-icon" data-song="${spotifyURI}" data-type="${metadata}">
                    <img src="resources/spotify-icon.png" alt="Spotify Icon">
                </a>
                ` : '')}
                ${metadata === 'song' && youtubeTrackID !== 'null' ? `
                <a href="#" class="youtube-icon" data-video="${youtubeTrackID}" data-type="${metadata}">
                    <img src="resources/youtube-icon.png" alt="YouTube Icon">
                </a>
                ` : ''}
            </div>
        </div>
        </div>
    `;

    // Create and append the checkmark cells
    const checkmarkRecordedCell = newRow.insertCell(1);
    const checkmarkMixedCell = newRow.insertCell(2);
    const checkmarkMasteredCell = newRow.insertCell(3);
    checkmarkRecordedCell.className = `checkmark ${recorded === "True" ? "checkmark-recorded" : "checkmark-off"}`;
    checkmarkMixedCell.className = `checkmark ${mixed === "True" ? "checkmark-mixed" : "checkmark-off"}`;
    checkmarkMasteredCell.className = `checkmark ${mastered === "True" ? "checkmark-mastered" : "checkmark-off"}`;
}


