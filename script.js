const videos = [
  { youtubeId: 'dQw4w9WgXcQ', title: 'The art of slowing down | a quiet morning in the mountains', channel: 'Maya Winters', views: '248K views', age: '2 days ago', duration: '18:42', category: 'Travel', image: 'photo-1470770841072-f978cf4d019e', avatar: 'MW', color: '#b67d62' },
  { youtubeId: 'jNQXAC9IVRw', title: 'I made a song using only sounds from my kitchen', channel: 'Room Tone', views: '1.2M views', age: '1 week ago', duration: '12:08', category: 'Music', image: 'photo-1516280440614-37939bbacd81', avatar: 'RT', color: '#756ac6' },
  { youtubeId: '9bZkp7q19f0', title: 'A tiny desk setup that changed how I work', channel: 'Studio Sunday', views: '86K views', age: '4 days ago', duration: '9:31', category: 'Design', image: 'photo-1498050108023-c5249f4df085', avatar: 'SS', color: '#6f9a81' },
  { youtubeId: 'kJQP7kiw5Fk', title: 'How the internet actually works (in 10 minutes)', channel: 'Curious Circuit', views: '534K views', age: '3 weeks ago', duration: '10:16', category: 'Technology', image: 'photo-1518770660439-4636190af475', avatar: 'CC', color: '#5589b7' },
  { youtubeId: 'RgKAFK5djSk', title: '24 hours in Tokyo — finding the hidden coffee shops', channel: 'Nina Explores', views: '319K views', age: '6 days ago', duration: '21:05', category: 'Travel', image: 'photo-1493976040374-85c8e12f0c0e', avatar: 'NE', color: '#c27d81' },
  { youtubeId: '3JZ_D3ELwOQ', title: 'Building a cozy world in Minecraft, one block at a time', channel: 'Pixel Garden', views: '92K views', age: '1 day ago', duration: '32:17', category: 'Gaming', image: 'photo-1511512578047-dfb367046420', avatar: 'PG', color: '#75a85e' },
  { youtubeId: 'fJ9rUzIMcZQ', title: 'The perfect crispy potato — three ways', channel: 'Good Things Cooking', views: '704K views', age: '2 weeks ago', duration: '14:29', category: 'Cooking', image: 'photo-1504674900247-0877df9cc836', avatar: 'GC', color: '#ce8050' },
  { youtubeId: 'L_jWHffIx5E', title: 'Why this old camera still feels like magic', channel: 'Analog Days', views: '177K views', age: '5 days ago', duration: '16:53', category: 'Technology', image: 'photo-1516035069371-29a1b244cc32', avatar: 'AD', color: '#a27a55' },
  { youtubeId: 'hT_nvWreIhg', title: 'Live from the studio: late night jazz & soft rain', channel: 'Blue Hour Radio', views: 'Live now', age: '12K watching', duration: 'LIVE', category: 'Live', image: 'photo-1519608487953-e999c86e7455', avatar: 'BH', color: '#5d72a8' },
  { youtubeId: 'CevxZvSJLk8', title: 'Designing a brand identity from the ground up', channel: 'Make Good Studio', views: '63K views', age: '1 month ago', duration: '26:41', category: 'Design', image: 'photo-1455390582262-044c1b6e4a6b', avatar: 'MG', color: '#b87895' },
  { youtubeId: 'YQHsXMglC9A', title: 'A conversation about making things that matter', channel: 'The Long Way', views: '41K views', age: '3 days ago', duration: '48:12', category: 'Podcasts', image: 'photo-1475721027785-f74eccf877e2', avatar: 'LW', color: '#9a795f' },
  { youtubeId: 'OPf0YbXqDm0', title: 'The most satisfying speedrun you will see today', channel: 'Checkpoint', views: '980K views', age: '2 days ago', duration: '8:56', category: 'Gaming', image: 'photo-1542751371-adc38448a05e', avatar: 'CP', color: '#9871ba' }
];

const grid = document.querySelector('#videoGrid');
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const emptyState = document.querySelector('#emptyState');
const videoCount = document.querySelector('#videoCount');
const sectionTitle = document.querySelector('#sectionTitle');
const watchView = document.querySelector('#watchView');
const homeSections = [document.querySelector('.category-bar'), document.querySelector('.video-section')];
let activeCategory = 'All';
let searchTerm = '';
let currentVideo = null;
let currentCard = null;
const reactionsById = new Map();
const commentsById = new Map();

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderVideos() {
  const normalizedSearchTerm = searchTerm.toLocaleLowerCase();
  const filtered = videos.filter((video) => {
    const matchesCategory = activeCategory === 'All' || activeCategory === 'Trending' || activeCategory === 'Subscriptions' || video.category === activeCategory;
    return matchesCategory && video.title.toLocaleLowerCase().includes(normalizedSearchTerm);
  });

  grid.replaceChildren(...filtered.map((video) => createVideoCard(video)));
  emptyState.hidden = filtered.length !== 0;
  videoCount.textContent = `${filtered.length} videos`;
}

function createVideoCard(video) {
  const card = createElement('article', 'video-card');
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Watch ${video.title} by ${video.channel}`);
  card.dataset.youtubeId = video.youtubeId;

  const thumbnailWrap = createElement('div', 'thumbnail-wrap');
  const thumbnail = createElement('img', 'thumbnail');
  thumbnail.src = `https://images.unsplash.com/${video.image}?auto=format&fit=crop&w=720&q=80`;
  thumbnail.alt = '';
  thumbnail.loading = 'lazy';
  const duration = createElement('span', 'duration', video.duration);
  const playOverlay = createElement('span', 'play-overlay');
  playOverlay.setAttribute('aria-hidden', 'true');
  playOverlay.append(createElement('span', '', '▶'));
  thumbnailWrap.append(thumbnail, duration, playOverlay);

  const info = createElement('div', 'video-info');
  const avatar = createElement('span', 'channel-avatar', video.avatar);
  avatar.style.background = video.color;
  avatar.setAttribute('aria-hidden', 'true');
  const copy = createElement('div', 'video-copy');
  copy.append(createElement('h2', 'video-title', video.title));
  const meta = createElement('p', 'video-meta');
  meta.append(document.createTextNode(video.channel + ' '));
  const verified = createElement('span', 'verified', '●');
  verified.setAttribute('aria-label', 'verified');
  meta.append(verified, document.createElement('br'), document.createTextNode(`${video.views} · ${video.age}`));
  copy.append(meta);
  info.append(avatar, copy);
  card.append(thumbnailWrap, info);
  return card;
}

function getReaction(videoId) {
  if (!reactionsById.has(videoId)) reactionsById.set(videoId, { likes: 0, dislikes: 0, selected: null });
  return reactionsById.get(videoId);
}

function renderReactions(container, videoId) {
  const state = getReaction(videoId);
  const controls = createElement('div', 'reaction-controls');
  controls.setAttribute('aria-label', 'Video reactions');
  const makeButton = (kind, icon, count) => {
    const selected = state.selected === kind;
    const button = createElement('button', `reaction-button${selected ? ' selected' : ''}`);
    button.type = 'button';
    button.setAttribute('aria-label', `${kind === 'like' ? 'Like' : 'Dislike'}: ${count}`);
    button.setAttribute('aria-pressed', String(selected));
    button.append(createElement('span', 'reaction-icon', icon), createElement('span', 'reaction-count', count.toLocaleString()));
    button.addEventListener('click', () => {
      if (state.selected === kind) {
        state[kind === 'like' ? 'likes' : 'dislikes'] -= 1;
        state.selected = null;
      } else {
        if (state.selected) state[state.selected === 'like' ? 'likes' : 'dislikes'] -= 1;
        state[kind === 'like' ? 'likes' : 'dislikes'] += 1;
        state.selected = kind;
      }
      renderReactions(container, videoId);
    });
    return button;
  };
  controls.append(makeButton('like', '👍', state.likes), makeButton('dislike', '👎', state.dislikes));
  container.replaceChildren(controls);
}

function getComments(videoId) {
  if (!commentsById.has(videoId)) commentsById.set(videoId, []);
  return commentsById.get(videoId);
}

function renderComments(container, videoId) {
  const comments = getComments(videoId);
  container.replaceChildren();
  container.append(createElement('h2', 'comments-heading', `Comments (${comments.length})`));
  const form = createElement('form', 'comment-form');
  const input = createElement('textarea', 'comment-input');
  input.name = 'comment';
  input.rows = 2;
  input.maxLength = 500;
  input.placeholder = 'Add a comment...';
  input.setAttribute('aria-label', 'Write a comment');
  input.required = true;
  const actions = createElement('div', 'comment-form-actions');
  const submit = createElement('button', 'comment-submit', 'Comment');
  submit.type = 'submit';
  actions.append(submit);
  form.append(input, actions);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    comments.unshift({ author: 'You', text, createdAt: new Date() });
    renderComments(container, videoId);
    container.querySelector('.comment-input')?.focus();
  });
  container.append(form);

  const list = createElement('div', 'comment-list');
  if (!comments.length) {
    list.append(createElement('p', 'comments-empty', 'Be the first to share your thoughts.'));
  } else {
    comments.forEach((comment) => {
      const item = createElement('article', 'comment-item');
      const avatar = createElement('span', 'comment-avatar', comment.author.slice(0, 1).toUpperCase());
      avatar.setAttribute('aria-hidden', 'true');
      const body = createElement('div', 'comment-body');
      const byline = createElement('p', 'comment-byline');
      byline.append(createElement('strong', '', comment.author), createElement('span', '', comment.createdAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })));
      body.append(byline, createElement('p', 'comment-text', comment.text));
      item.append(avatar, body);
      list.append(item);
    });
  }
  container.append(list);
}

function createRecommendation(video) {
  const button = createElement('button', 'watch-recommendation');
  button.type = 'button';
  button.setAttribute('aria-label', `Watch ${video.title} by ${video.channel}`);
  const image = createElement('img');
  image.src = `https://images.unsplash.com/${video.image}?auto=format&fit=crop&w=360&q=75`;
  image.alt = '';
  image.loading = 'lazy';
  const copy = createElement('span', 'recommendation-copy');
  copy.append(createElement('strong', '', video.title), createElement('span', '', `${video.channel} · ${video.views}`));
  button.append(image, copy);
  button.addEventListener('click', () => showWatchView(video, null, false));
  return button;
}

function showWatchView(video, card = null, addHistory = true) {
  if (!video || !watchView) return;
  currentVideo = video;
  currentCard = card || currentCard;
  watchView.replaceChildren();

  const backButton = createElement('button', 'watch-back', '← Back to videos');
  backButton.type = 'button';
  backButton.addEventListener('click', closeWatchView);
  const layout = createElement('div', 'watch-layout');
  const playerColumn = createElement('div', 'watch-player-column');

  const player = createElement('iframe', 'watch-player');
  player.src = `https://www.youtube.com/embed/${encodeURIComponent(video.youtubeId)}?autoplay=1`;
  player.title = `YouTube video player: ${video.title}`;
  player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  player.allowFullscreen = true;
  player.referrerPolicy = 'strict-origin-when-cross-origin';

  const title = createElement('h1', 'watch-title', video.title);
  const channelRow = createElement('div', 'watch-channel-row');
  const avatar = createElement('span', 'watch-channel-avatar', video.avatar);
  avatar.style.background = video.color;
  const channelName = createElement('strong', '', video.channel);
  const views = createElement('span', 'watch-views', video.views);
  channelRow.append(avatar, channelName, views);
  const reactions = createElement('div', 'watch-reactions');
  renderReactions(reactions, video.youtubeId);
  const comments = createElement('section', 'watch-comments');
  comments.setAttribute('aria-label', 'Comments');
  renderComments(comments, video.youtubeId);
  playerColumn.append(player, title, channelRow, reactions, comments);

  const recommendations = createElement('aside', 'watch-recommendations');
  recommendations.append(createElement('h2', '', 'Up next'));
  videos.filter((item) => item.youtubeId !== video.youtubeId).forEach((item) => recommendations.append(createRecommendation(item)));
  layout.append(playerColumn, recommendations);
  watchView.append(backButton, layout);

  homeSections.forEach((section) => { if (section) section.hidden = true; });
  watchView.hidden = false;
  watchView.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (addHistory) history.pushState({ watchView: true }, '', '#watch');
}

function closeWatchView(updateHistory = true) {
  if (!watchView || watchView.hidden) return;
  watchView.hidden = true;
  watchView.replaceChildren();
  homeSections.forEach((section) => { if (section) section.hidden = false; });
  if (updateHistory && location.hash === '#watch') history.back();
  if (currentCard?.isConnected) currentCard.focus({ preventScroll: true });
  currentVideo = null;
  currentCard = null;
}

grid.addEventListener('click', (event) => {
  if (event.target.closest('.more-button')) return;
  const card = event.target.closest('.video-card');
  if (!card) return;
  const video = videos.find((item) => item.youtubeId === card.dataset.youtubeId);
  if (video) showWatchView(video, card);
});
grid.addEventListener('keydown', (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.video-card')) {
    event.preventDefault();
    const video = videos.find((item) => item.youtubeId === event.target.dataset.youtubeId);
    if (video) showWatchView(video, event.target);
  }
});

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
window.addEventListener('popstate', () => {
  if (watchView && !watchView.hidden) closeWatchView(false);
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && watchView && !watchView.hidden) closeWatchView();
});

renderVideos();
