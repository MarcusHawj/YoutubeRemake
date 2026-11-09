const watchView = document.querySelector('#watchView');
const homeSections = [
  document.querySelector('.category-bar'),
  document.querySelector('.video-section')
];
let currentVideoCard = null;

function cardDetails(card) {
  return {
    title: card.querySelector('.video-title')?.textContent.trim() || 'Untitled video',
    channel: card.querySelector('.video-meta')?.childNodes[0]?.textContent.trim() || 'YoutubeRemake creator',
    views: card.querySelector('.video-meta')?.innerText.split('\n').slice(1).join(' ').trim() || '',
    poster: card.querySelector('.thumbnail')?.src || '',
    avatar: card.querySelector('.channel-avatar')?.textContent.trim() || 'YR',
    avatarColor: card.querySelector('.channel-avatar')?.style.background || '#555'
  };
}

function makeRecommendation(card) {
  const video = cardDetails(card);
  const item = document.createElement('button');
  item.className = 'watch-recommendation';
  item.type = 'button';
  item.setAttribute('aria-label', `Watch ${video.title} by ${video.channel}`);

  const thumbnail = document.createElement('img');
  thumbnail.src = video.poster;
  thumbnail.alt = '';
  thumbnail.loading = 'lazy';
  const details = document.createElement('span');
  details.className = 'recommendation-copy';
  const title = document.createElement('strong');
  title.textContent = video.title;
  const metadata = document.createElement('span');
  metadata.textContent = `${video.channel} · ${video.views}`;
  details.append(title, metadata);
  item.append(thumbnail, details);
  item.addEventListener('click', () => showWatchView(card));
  return item;
}

function showWatchView(card) {
  if (!card || !watchView) return;
  currentVideoCard = card;
  const video = cardDetails(card);
  const allCards = [...document.querySelectorAll('#videoGrid .video-card')];

  watchView.replaceChildren();
  const backButton = document.createElement('button');
  backButton.className = 'watch-back';
  backButton.type = 'button';
  backButton.textContent = '← Back to videos';
  backButton.addEventListener('click', closeWatchView);

  const layout = document.createElement('div');
  layout.className = 'watch-layout';
  const playerColumn = document.createElement('div');
  playerColumn.className = 'watch-player-column';
  const player = document.createElement('video');
  player.className = 'watch-player';
  player.controls = true;
  player.playsInline = true;
  player.preload = 'metadata';
  player.poster = video.poster;
  player.setAttribute('aria-label', video.title);
  const source = document.createElement('source');
  source.src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
  source.type = 'video/mp4';
  player.append(source, 'Your browser does not support HTML video.');

  const title = document.createElement('h1');
  title.className = 'watch-title';
  title.textContent = video.title;
  const channelRow = document.createElement('div');
  channelRow.className = 'watch-channel-row';
  const avatar = document.createElement('span');
  avatar.className = 'watch-channel-avatar';
  avatar.style.background = video.avatarColor;
  avatar.textContent = video.avatar;
  const channelName = document.createElement('strong');
  channelName.textContent = video.channel;
  const viewCount = document.createElement('span');
  viewCount.className = 'watch-views';
  viewCount.textContent = video.views;
  channelRow.append(avatar, channelName, viewCount);
  playerColumn.append(player, title, channelRow);

  const recommendations = document.createElement('aside');
  recommendations.className = 'watch-recommendations';
  const heading = document.createElement('h2');
  heading.textContent = 'Up next';
  recommendations.append(heading);
  allCards.filter((item) => item !== card).forEach((item) => recommendations.append(makeRecommendation(item)));
  layout.append(playerColumn, recommendations);
  watchView.append(backButton, layout);

  homeSections.forEach((section) => { if (section) section.hidden = true; });
  watchView.hidden = false;
  watchView.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.pushState({ watchView: true }, '', '#watch');
}

function closeWatchView(updateHistory = true) {
  if (watchView.hidden) return;
  watchView.hidden = true;
  homeSections.forEach((section) => { if (section) section.hidden = false; });
  watchView.replaceChildren();
  if (updateHistory && location.hash === '#watch') history.back();
  if (currentVideoCard?.isConnected) currentVideoCard.focus({ preventScroll: true });
}

document.querySelector('#videoGrid')?.addEventListener('click', (event) => {
  if (event.target.closest('.more-button')) return;
  const card = event.target.closest('.video-card');
  if (card) showWatchView(card);
});

document.querySelector('#videoGrid')?.addEventListener('keydown', (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.video-card')) {
    event.preventDefault();
    showWatchView(event.target);
  }
});

window.addEventListener('popstate', () => {
  if (!watchView.hidden) closeWatchView(false);
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !watchView.hidden) closeWatchView();
});
