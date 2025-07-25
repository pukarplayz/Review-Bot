# 📋 Discord Review Bot

A powerful and easy-to-use Discord bot that allows users to submit reviews with a star rating and optional image. Perfect for servers looking to collect feedback or testimonials.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen) ![Discord.js](https://img.shields.io/badge/discord.js-v14-blue)

---

## 🚀 Features

- 💬 Slash command to submit reviews (`/review`)
- 📌 Custom "Submit a Review" button
- ⭐ Star rating from 1 to 5
- 🖼️ Image attachment support
- 📑 Panel system for easy access
- 🔐 Admin-only panel setup
- ⚙️ Fully customizable via `config.js`

---

## 📁 Project Structure

```
review-bot/
├── commands/
│   ├── review.js
│   └── sendpanel.js
├── config.js
├── index.js
├── package.json
└── README.md
```

---

## 🔧 Installation

1. **Clone the repo:**

```bash
git clone https://github.com/yourusername/review-bot.git
cd review-bot
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure your bot in `config.js`:**

```js
module.exports = {
  token: "YOUR_BOT_TOKEN",
  clientId: "YOUR_CLIENT_ID",
  guildId: "YOUR_GUILD_ID",
  reviewChannel: "REVIEW_CHANNEL_ID",
  embed: {
    color: "#2b2d31",
    footer: "Your Server Name",
  }
}
```

> 💡 Replace the placeholders with your actual values.

4. **Run the bot:**

```bash
node index.js
```

---

## 📎 Usage

- Use `/sendpanel` (Admin only) to post the review panel.
- Members can click the **Submit A Review** button or use `/review`.
- A modal will appear allowing:
  - Review text input
  - Star rating (1-5)
  - Optional image URL
- Reviews will be posted in the configured review channel.

---

## 🛠️ Requirements

- Node.js v18 or newer
- A Discord bot token
- Discord server with permissions to manage slash commands

---

## 🧑‍💻 Contributing

Feel free to submit pull requests or open issues!  
All contributions are welcome to improve this bot.

---

## 📜 License

This project is open-source under the MIT License.

---

## 🙏 Credits

Made with ❤️ by [Pukar Adhikari](https://github.com/pukarplayz)

---
