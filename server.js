const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// تنزيل فيديو
app.get('/download', async (req, res) => {
  const url = req.query.url;
  if (!ytdl.validateURL(url)) return res.status(400).json({ error: 'Invalid URL' });

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
  res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
  ytdl(url, { format: 'mp4', quality: 'highestvideo' }).pipe(res);
});

// تنزيل صوت MP3
app.get('/download/audio', async (req, res) => {
  const url = req.query.url;
  if (!ytdl.validateURL(url)) return res.status(400).json({ error: 'Invalid URL' });

  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
  res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
  ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
});

app.listen(PORT, () => console.log(`🚀 Listening on port ${PORT}`));