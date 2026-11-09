const watchView = document.querySelector('#watchView');
const homeSections = [
  document.querySelector('.category-bar'),
  document.querySelector('.video-section')
];
let currentVideoCard = null;
const reactionByTitle = new Map();
const commentsByTitle = new Map();

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

function getReaction(videoTitle) {
  if (!reactionByTitle.has(videoTitle)) {
    reactionByTitle.set(videoTitle, { likes: 0, dislikes: 0, selected: null });
  }
  return reactionByTitle.get(videoTitle);
}

function makeReactionButton(label, symbol, count, selected, onClick) {
  const button = document.createElement('button');
  button.className = `reaction-button${selected ? ' selected' : ''}`;
  button.type = 'button';
  button.setAttribute('aria-label', `${label}: ${count}`);
  button.setAttribute('aria-pressed', String(selected));

  const icon = document.createElement('span');
  icon.className = 'reaction-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = symbol;
  const countLabel = document.createElement('span');
  countLabel.className = 'reaction-count';
  countLabel.textContent = count.toLocaleString();
  button.append(icon, countLabel);
  button.addEventListener('click', onClick);
  return button;
}

function renderReactions(container, videoTitle) {
  const state = getReaction(videoTitle);
  const controls = document.createElement('div');
  controls.className = 'reaction-controls';
  controls.setAttribute('aria-label', 'Video reactions');

  controls.append(
    makeReactionButton('Like', '👍', state.likes, state.selected === 'like', () => {
      if (state.selected === 'like') {
        state.likes -= 1;
        state.selected = null;
      } else {
        if (state.selected === 'dislike') state.dislikes -= 1;
        state.likes += 1;
        state.selected = 'like';
      }
      renderReactions(container, videoTitle);
    }),
    makeReactionButton('Dislike', '👎', state.dislikes, state.selected === 'dislike', () => {
      if (state.selected === 'dislike') {
        state.dislikes -= 1;
        state.selected = null;
      } else {
        if (state.selected === 'like') state.likes -= 1;
        state.dislikes += 1;
        state.selected = 'dislike';
      }
      renderReactions(container, videoTitle);
    })
  );
  container.replaceChildren(controls);
}

function getComments(videoTitle) {
  if (!commentsByTitle.has(videoTitle)) commentsByTitle.set(videoTitle, []);
  return commentsByTitle.get(videoTitle);
}

function renderComments(container, videoTitle) {
  const comments = getComments(videoTitle);
  container.replaceChildren();

  const heading = document.createElement('h2');
  heading.className = 'comments-heading';
  heading.textContent = `Comments (${comments.length})`;

  const form = document.createElement('form');
  form.className = 'comment-form';
  const input = document.createElement('textarea');
  input.className = 'comment-input';
  input.name = 'comment';
  input.rows = 2;
  input.maxLength = 500;
  input.placeholder = 'Add a comment...';
  input.setAttribute('aria-label', 'Write a comment');
  input.required = true;
  const formActions = document.createElement('div');
  formActions.className = 'comment-form-actions';
  const submit = document.createElement('button');
  submit.className = 'comment-submit';
  submit.type = 'submit';
  submit.textContent = 'Comment';
  formActions.append(submit);
  form.append(input, formActions);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    comments.unshift({ author: 'You', text, createdAt: new Date() });
    renderComments(container, videoTitle);
    container.querySelector('.comment-input')?.focus();
  });

  const list = document.createElement('div');
  list.className = 'comment-list';
  if (comments.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'comments-empty';
    empty.textContent = 'Be the first to share your thoughts.';
    list.append(empty);
  } else {
    comments.forEach((comment) => {
      const item = document.createElement('article');
      item.className = 'comment-item';
      const avatar = document.createElement('span');
      avatar.className = 'comment-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = comment.author.slice(0, 1).toUpperCase();
      const body = document.createElement('div');
      body.className = 'comment-body';
      const byline = document.createElement('p');
      byline.className = 'comment-byline';
      const author = document.createElement('strong');
      author.textContent = comment.author;
      const time = document.createElement('span');
      time.textContent = comment.createdAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      byline.append(author, time);
      const text = document.createElement('p');
      text.className = 'comment-text';
      text.textContent = comment.text;
      body.append(byline, text);
      item.append(avatar, body);
      list.append(item);
    });
  }
  container.append(heading, form, list);
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
  const reactions = document.createElement('div');
  reactions.className = 'watch-reactions';
  renderReactions(reactions, video.title);

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

  const comments = document.createElement('section');
  comments.className = 'watch-comments';
  comments.setAttribute('aria-label', 'Comments');
  renderComments(comments, video.title);
  playerColumn.append(player, title, reactions, channelRow, comments);

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
