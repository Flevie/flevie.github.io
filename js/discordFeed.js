let messages = [];
let currentIndex = 0;

async function loadDiscordFeed() {
  const feedContainer = document.getElementById("feed");
  feedContainer.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch("https://discord-feed-api.vercel.app/api/discord-feed");
    const data = await response.json();

    // Sort and take only 3 latest messages
    messages = data
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(3, 3);

    currentIndex = 0;
    renderMessage();
  } catch (err) {
    feedContainer.innerHTML = "<p>⚠️ Failed to load feed.</p>";
    console.error("Discord feed error:", err);
  }
}

function renderMessage() {
  const feedContainer = document.getElementById("feed");

  if (!messages.length) {
    feedContainer.innerHTML = "<p>No messages yet.</p>";
    return;
  }

  const msg = messages[currentIndex];
  const date = new Date(msg.timestamp).toLocaleString();

  let formatted = msg.content
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");

  feedContainer.innerHTML = `
    <div class="message">
      <p><strong>${msg.author}</strong> <span class="timestamp">${date}</span></p>
      <div class="content">${formatted}</div>
    </div>
    <div class="nav">
      <button id="prevBtn" class="nav-btn">⬅️</button>
      <span>${currentIndex + 1} / ${messages.length}</span>
      <button id="nextBtn" class="nav-btn">➡️</button>
    </div>
  `;

  // Button event listeners
  document.getElementById("prevBtn").onclick = () => changeMessage(-1);
  document.getElementById("nextBtn").onclick = () => changeMessage(1);
}

function changeMessage(direction) {
  currentIndex = (currentIndex + direction + messages.length) % messages.length;
  renderMessage();
}

// Load initially
loadDiscordFeed();

// Auto-refresh feed every 30 seconds and keep currentIndex in range
setInterval(async () => {
  const oldAuthor = messages[currentIndex]?.author;
  await loadDiscordFeed();
  // If the same author exists, stay near same index if possible
  if (oldAuthor) {
    const idx = messages.findIndex(m => m.author === oldAuthor);
    if (idx >= 0) currentIndex = idx;
  }
}, 30000);