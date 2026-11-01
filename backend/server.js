const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
// 允许跨域，这样你的前端 HTML 才能请求这个接口
app.use(cors());
// 解析前端传来的 JSON 数据
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "请输入需求" });
  }

  // 系统的约束提示词
  const systemPrompt = `你是一个专业的前端开发专家。请生成一个 Vue3 的组件代码，必须包含 <template> 和 <script setup>。需求如下：${prompt}`;

  try {
    // 调用通义千问 API
    const response = await axios.post(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
      {
        model: "deepseek-v4-pro", // 已修改为纯文本模型 qwen-turbo
        input: {
          messages: [
            { role: "system", content: "你是一个专业的前端开发专家。" },
            { role: "user", content: systemPrompt },
          ],
        },
        parameters: {
          result_format: "message", // 确保返回格式为标准的 message 格式
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    // 提取大模型返回的代码 (注意这里的层级是 output.choices)
    const generatedCode = response.data.output.choices[0].message.content;

    // 返回给前端
    res.json({ code: generatedCode });
  } catch (error) {
    console.error(
      "API 调用失败:",
      error.response ? error.response.data : error.message,
    );
    res.status(500).json({
      error: "调用大模型失败",
      details: error.response ? error.response.data : error.message,
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Demo 后端已启动: http://localhost:${PORT}`);
  console.log(`=================================`);
});
