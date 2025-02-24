const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/upload', async (req, res) => {
  const imageData = req.body.image;

  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{
          role: "user",
          content: [{
            type: "text",
            text: `
            画像の人物について、以下の3つの評価を行ってください：
            
            1. **美人度またはイケメン度（100点満点）**
               - 必ず点数をつけてください。（例：「92点」）
            2. **推定年齢**
               - 見た目から推定した年齢を出してください。（例：「28歳くらい」）
            3. **特筆すべき長所（★5段階評価）**
               - 「清潔感」「笑顔の魅力」「ファッションセンス」など3項目を選び、それぞれ★で評価してください。（例：「清潔感★★★★★, 笑顔の魅力★★★★☆, ファッション★★★☆☆」）
      
            以上を簡潔に出力してください。
            `
          }, {
            type: "image_url",
            image_url: { url: imageData }
          }]
        }],
        max_tokens: 200
      });

    const result = completion.choices[0].message.content;

    console.log("AIからの結果:", result);
    res.json({ result });

  } catch (error) {
    console.error("エラー:", error);
    res.status(500).json({ error: "AI判定でエラーが発生しました。" });
  }
});

app.listen(3000, () => {
  console.log('サーバーがポート3000で起動しました');
});
