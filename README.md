# YoutubeRemake

YoutubeRemake is a lightweight, responsive video discovery interface built with HTML, CSS, and vanilla JavaScript. Browse a curated video grid, filter by title or category, and open a watch view with an embedded YouTube player and related recommendations.

**Live demo:** [https://marcushawj.github.io/clipstream/](https://marcushawj.github.io/clipstream/)

## Features

- Responsive, dark-themed layout for desktop and mobile
- Video cards with thumbnails, titles, channel names, and view counts
- Live title search that filters the grid as you type
- Category filters, including Music, Design, Technology, Travel, Gaming, and more
- Clickable video cards with keyboard support
- Watch view with an embedded YouTube player, video details, and recommended videos
- Like and Dislike buttons with interactive counts
- Per-video comment form and comment list
- Back button, browser history support, and Escape-key navigation

> Likes, dislikes, and comments are stored in browser memory only. They are not shared across visitors and reset when the page is reloaded.

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- YouTube embedded player

## Installation

You only need a modern web browser. No package manager, build process, or server-side code is required.

1. Clone the repository:

   ```bash
   git clone https://github.com/MarcusHawj/YoutubeRemake.git
   ```

2. Change into the project directory:

   ```bash
   cd YoutubeRemake
   ```

3. Open `index.html` in a browser. For local development, you can also serve the directory with any static file server, for example:

   ```bash
   python3 -m http.server 8000
   ```

   Then visit [http://localhost:8000](http://localhost:8000).

## Usage

1. Open the home page to browse the video cards.
2. Type in the search bar to filter videos by title. Clear the query to show the full list again.
3. Select a category chip or use the sidebar to browse a section.
4. Click a video card, or focus it and press **Enter** or **Space**, to open its watch view.
5. Play the embedded video, view its channel and recommendations, and use Like, Dislike, or the comment form.
6. Choose **Back to videos**, press **Escape**, or use your browser's Back button to return to the grid.

## Updating the video catalog

The sample video catalog is defined in `script.js` in the `videos` array. Each entry includes a `youtubeId`, title, channel, view count, category, and thumbnail image identifier. Replace the sample `youtubeId` values with the IDs of videos you want to feature. The watch view uses each ID to create a YouTube embed URL in this format:

```text
https://www.youtube.com/embed/VIDEO_ID
```

Thumbnails currently use Unsplash image URLs. Replace the `image` values or update the thumbnail URL construction in `script.js` to use your own assets.

## Project files

- `index.html` — page structure and application entry point
- `style.css` — responsive layout and watch-view styling
- `script.js` — video catalog, rendering, search, navigation, player, reactions, and comments

## Notes

- YouTube videos are served by YouTube's embedded player and may have embedding restrictions set by their owners.
- The Google Fonts and Unsplash images used by the interface require an internet connection.
- YoutubeRemake is a front-end demo. It does not include user accounts, a database, persistent comments, or a video upload service.

## License

No license has been specified for this project. Contact the repository owner before redistributing or reusing the code.
