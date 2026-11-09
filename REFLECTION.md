# Reflection: Building YoutubeRemake with GitHub Copilot

## 1. What did you ask Copilot to help you build? How did you break down the problem?

I used GitHub Copilot Chat to build **YoutubeRemake**, a video sharing website inspired by YouTube. It has a home page of video cards, a search bar, category filters, a collapsible sidebar, and a watch view for playing videos. I built it with HTML, CSS, and JavaScript, and hosted it on GitHub Pages.

Before I started, I planned out a list of prompts (with help from another AI tool) so I could build one feature at a time instead of asking for the whole site at once:

1. The basic layout: top bar, logo, search bar, sidebar, and a dark theme
2. A grid of video cards built from an array of video data
3. A watch view that opens when a card is clicked
4. Like/dislike buttons and a comment section
5. Search filtering

Breaking the problem down this way made each response easier to understand and test. After each step, I committed the code to GitHub and checked the live site before moving on.

<img width="467" height="628" alt="Copilot creating the starting layout" src="https://github.com/user-attachments/assets/373385f9-870c-4e79-974d-7d242a636ec4" />

## 2. How did your approach to asking questions change as you worked?

At first my prompts mostly described what I wanted the site to look like. As I worked, I learned to be more specific and to give Copilot context.

The biggest example was when I realized the video cards weren't clickable. I assumed clicking a card would play the video, but when I looked at my `script.js`, there was no click handler, no video links in the data, and no watch view. Copilot had built exactly what I asked for and nothing more. For my next prompt, I pasted my current `index.html` and `script.js` and listed exactly what I needed: a `youtubeId` field for each video, a click handler, and a watch view with a YouTube embed iframe and a back button. I also started asking for the **full updated files**, so I could paste them into GitHub without trying to merge small pieces of code by hand.

<img width="471" height="589" alt="Asking Copilot to make the video cards clickable" src="https://github.com/user-attachments/assets/0022401a-c72e-4d70-b8e3-8790c2c6a1df" />

## 3. What parts of the development process with GitHub Copilot surprised you?

- **How much it built from one prompt.** The first response gave me a full layout with a sidebar, category chips, and a dark theme that already looked like a real website.
- **How literal it is.** Copilot doesn't fill in features you didn't ask for. It made cards with a play icon, but they didn't actually do anything until I specifically asked for click behavior.
- **That it adds details I didn't ask for.** It added channel avatars, view counts, upload dates, video durations, and even a "LIVE" video, which made the site feel realistic.
- **That I could do everything on the GitHub website.** I used Copilot Chat on github.com, created and edited files in the browser, and tested with GitHub Pages, without a code editor or terminal.

<img width="493" height="749" alt="Copilot's response to the video grid prompt" src="https://github.com/user-attachments/assets/633a1f5b-fc62-402f-bc47-540d24c21c8b" />

## 4. What did you learn about the technology you used that you didn't know before?

- **GitHub Pages deployments:** Every commit triggers a new "pages build and deployment" run. When I committed quickly several times in a row, some runs showed as **Cancelled**. At first I thought something broke, but GitHub cancels older runs so only the newest version gets deployed.
- **YouTube embeds:** To play a YouTube video on your own site, you need the embed URL format (`youtube.com/embed/VIDEO_ID`), not the normal watch link. Some videos can't be embedded because the uploader turned it off, and embeds don't work when opening the HTML file directly from your computer.
- **Rendering data with JavaScript:** The video cards aren't written in the HTML. They're generated from an array of objects in `script.js` using `map()` and template literals, which makes it easy to add more videos or filter them with search and categories.
- **Event listeners:** Elements only respond to clicks when JavaScript attaches an event listener to them. Looking good isn't the same as being interactive.

<img width="510" height="128" alt="GitHub Actions run cancelled by a newer deployment" src="https://github.com/user-attachments/assets/b87ec010-8afc-4e0e-a666-39c47679b143" />

## 5. What would you do differently if you had to build this again?

- **Plan the data first.** I would include a `youtubeId` for each video from the beginning, instead of adding it after realizing the cards couldn't play anything.
- **Write more of my own prompts.** I started from a prepared list. Next time, I'd write more follow-up prompts myself, based on what I see while testing.
- **Test each feature right away.** I'd click every button after each change so I catch missing features earlier.
- **Use VS Code with Copilot.** Working in the browser was convenient, but copying and pasting full files was slow. Inline Copilot suggestions in VS Code and Live Server previews would make changes faster.
