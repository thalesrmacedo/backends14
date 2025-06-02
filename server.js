const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const HF_API_TOKEN = 'CHAVE_API_AQUI'; // Substitua pelo seu token da Hugging Face
const HF_MODEL = 'HuggingFaceH4/zephyr-7b-beta'; // ou outro modelo disponível

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        inputs: message,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
        }
      }
    );

    const respostaGerada = response.data?.[0]?.generated_text || "Erro ao gerar resposta";
    res.json({ reply: respostaGerada });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Erro ao consultar Hugging Face');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
