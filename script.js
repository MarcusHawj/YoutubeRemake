const videos = [
  { title: 'The art of slowing down | a quiet morning in the mountains', channel: 'Maya Winters', views: '248K views', age: '2 days ago', duration: '18:42', category: 'Travel', image: 'photo-1470770841072-f978cf4d019e', avatar: 'MW', color: '#b67d62' },
  { title: 'I made a song using only sounds from my kitchen', channel: 'Room Tone', views: '1.2M views', age: '1 week ago', duration: '12:08', category: 'Music', image: 'photo-1516280440614-37939bbacd81', avatar: 'RT', color: '#756ac6' },
  { title: 'A tiny desk setup that changed how I work', channel: 'Studio Sunday', views: '86K views', age: '4 days ago', duration: '9:31', category: 'Design', image: 'photo-1498050108023-c5249f4df085', avatar: 'SS', color: '#6f9a81' },
  { title: 'How the internet actually works (in 10 minutes)', channel: 'Curious Circuit', views: '534K views', age: '3 weeks ago', duration: '10:16', category: 'Technology', image: 'photo-1518770660439-4636190af475', avatar: 'CC', color: '#5589b7' },
  { title: '24 hours in Tokyo — finding the hidden coffee shops', channel: 'Nina Explores', views: '319K views', age: '6 days ago', duration: '21:05', category: 'Travel', image: 'photo-1493976040374-85c8e12f0c0e', avatar: 'NE', color: '#c27d81' },
  { title: 'Building a cozy world in Minecraft, one block at a time', channel: 'Pixel Garden', views: '92K views', age: '1 day ago', duration: '32:17', category: 'Gaming', image: 'photo-1511512578047-dfb367046420', avatar: 'PG', color: '#75a85e' },
  { title: 'The perfect crispy potato — three ways', channel: 'Good Things Cooking', views: '704K views', age: '2 weeks ago', duration: '14:29', category: 'Cooking', image: 'photo-1504674900247-0877df9cc836', avatar: 'GC', color: '#ce8050' },
  { title: 'Why this old camera still feels like magic', channel: 'Analog Days', views: '177K views', age: '5 days ago', duration: '16:53', category: 'Technology', image: 'photo-1516035069371-29a1b244cc32', avatar: 'AD', color: '#a27a55' },
  { title: 'Live from the studio: late night jazz & soft rain', channel: 'Blue Hour Radio', views: 'Live now', age: '12K watching', duration: 'LIVE', category: 'Live', image: 'photo-1519608487953-e999c86e7455', avatar: 'BH', color: '#5d72a8' },
  { title: 'Designing a brand identity from the ground up', channel: 'Make Good Studio', views: '63K views', age: '1 month ago', duration: '26:41', category: 'Design', image: 'photo-1455390582262-044c1b6e4a6b', avatar: 'MG', color: '#b87895' },
  { title: 'A conversation about making things that matter', channel: 'The Long Way', views: '41K views', age: '3 days ago', duration: '48:12', category: 'Podcasts', image: 'photo-1475721027785-f74eccf877e2', avatar: 'LW', color: '#9a795f' },
  { title: 'The most satisfying speedrun you will see today', channel: 'Checkpoint', views: '980K views', age: '2 days ago', duration: '8:56', category: 'Gaming', image: 'photo-1542751371-adc38448a05e', avatar: 'CP', color: '#9871ba' }
];

const grid = document.querySelector('#videoGrid');
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const emptyState = document.querySelector('#emptyState');
const videoCount = document.querySelector('#videoCount');
const sectionTitle = document.querySelector('#sectionTitle');
let activeCategory = 'All';
let searchTerm = '';

function renderVideos() {
  const normalizedSearchTerm = searchTerm.toLocaleLowerCase();
  const filtered = videos.filter((video) => {
    const matchesCategory = activeCategory === 'All' || activeCategory === 'Trending' || activeCategory === 'Subscriptions' || video.category === activeCategory;
    const matchesTitle = video.title.toLocaleLowerCase().includes(normalizedSearchTerm);
    return matchesCategory && matchesTitle;
  });

  grid.innerHTML = filtered.map((video) => `
    <article class="video-card" tabindex="0" aria-label="${video.title} by ${video.channel}">
      <div class="thumbnail-wrap">
        <img class="thumbnail" src="https://images.unsplash.com/${video.image}?auto=format&fit=crop&w=720&q=80" alt="" loading="lazy">
        <span class="duration">${video.duration}</span>
        <span class="play-overlay" aria-hidden="true"><span>▶</span></span>
      </div>
      <div class="video-info">
        <span class="channel-avatar" style="background:${video.color}" aria-hidden="true">${video.avatar}</span>
        <div class="video-copy">
          <h2 class="video-title">${video.title}</h2>
          <p class="video-meta">${video.channel} <span class="verified" aria-label="verified">●</span><br>${video.views} · ${video.age}</p>
        </div>
        <button class="more-button" type="button" aria-label="More options for ${video.title}">⋮</button>
      </div>
    </article>
  `).join('');

  emptyState.hidden = filtered.length !== 0;
  videoCount.textContent = `${filtered.length} videos`;
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  searchTerm = searchInput.value.trim();
  renderVideos();
});
searchInput.addEventListener('input', () => {
  searchTerm = searchInput.value.trim();
  renderVideos();
});

document.querySelectorAll('.category-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    activeCategory = chip.dataset.topic;
    document.querySelectorAll('.category-chip').forEach((item) => item.classList.toggle('selected', item === chip));
    document.querySelectorAll('.nav-link').forEach((item) => item.classList.toggle('active', item.dataset.category === 'All'));
    sectionTitle.textContent = activeCategory === 'All' ? 'Recommended' : activeCategory;
    renderVideos();
  });
});

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    activeCategory = link.dataset.category;
    document.querySelectorAll('.nav-link').forEach((item) => item.classList.toggle('active', item === link));
    document.querySelectorAll('.category-chip').forEach((chip) => chip.classList.toggle('selected', chip.dataset.topic === 'All'));
    sectionTitle.textContent = activeCategory === 'All' ? 'Recommended' : activeCategory;
    renderVideos();
  });
});

document.querySelector('#menuButton').addEventListener('click', (event) => {
  const collapsed = document.body.classList.toggle('sidebar-collapsed');
  event.currentTarget.setAttribute('aria-expanded', String(!collapsed));
});

renderVideos();
