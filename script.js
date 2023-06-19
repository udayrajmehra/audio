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

// Attach click event listeners to the Spotify icons
spotifyIcons.forEach(icon => {
  icon.addEventListener('click', handleSpotifyIconClick);
});

// Attach click event listeners to the YouTube icons
youtubeIcons.forEach(icon => {
    icon.addEventListener('click', handleYoutubeIconClick);
});

// Attach click event listeners to the YouTube album icons
youtubeAlbumIcons.forEach(icon => {
    icon.addEventListener('click', handleYoutubeAlbumClick);
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
    checkmarkRecordedCell.className = `${recorded === "TRUE" ? "checkmark" : "checkmark-off"} checkmark-recorded`;
    checkmarkMixedCell.className = `${mixed === "TRUE" ? "checkmark" : "checkmark-off"} checkmark-mixed`;
    checkmarkMasteredCell.className = `${mastered === "TRUE" ? "checkmark" : "checkmark-off"} checkmark-mastered`;

    // Attach click event listeners to the Spotify icons in the newly added row
    const spotifyIcons = newRow.querySelectorAll('.spotify-icon');
    spotifyIcons.forEach(icon => {
        icon.addEventListener('click', handleSpotifyIconClick);
    });

    // Attach click event listeners to the YouTube icons in the newly added row
    const youtubeIcons = newRow.querySelectorAll('.youtube-icon');
    youtubeIcons.forEach(icon => {
        icon.addEventListener('click', handleYoutubeIconClick);
    });

    // Attach click event listeners to the YouTube album icons in the newly added row
    const youtubeAlbumIcons = newRow.querySelectorAll('.youtube-album-icon');
    youtubeAlbumIcons.forEach(icon => {
        icon.addEventListener('click', handleYoutubeAlbumClick);
    });
}  

window.onload = function() {
    // Get all tables
    const tables = document.querySelectorAll('table');
  
    tables.forEach(table => {
      // Get all table rows except the first two
      const tableRows = table.querySelectorAll('tbody tr:not(:nth-child(-n+2))');
  
      // Hide all table rows except the first two
      tableRows.forEach(row => {
        row.classList.add('hidden');
      });
  
      // Add a 'See more' button to the table
      const button = document.createElement('button');
      button.textContent = 'See more';
      button.classList.add('see-more'); // Add 'see-more' class to the button
      table.parentNode.insertBefore(button, table.nextSibling);
  
      // Add a click event listener to the 'See more' button
      button.addEventListener('click', function() {
        // Toggle the visibility of the additional table rows
        tableRows.forEach(row => {
          row.classList.toggle('hidden');
        });
  
        // Toggle the button text
        this.textContent = this.textContent === 'See more' ? 'See less' : 'See more';
      });
    });
  };
  

  

  