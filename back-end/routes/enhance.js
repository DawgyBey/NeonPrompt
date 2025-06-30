const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt.' });
  }

  // Clearer system-style instruction
  const refinedPrompt = `Enhance and modify the user written prompt but dont explain what user dont repeat what the user asked just give the prompt in a single sentence and give the user only enhanced prompt dont exlain the prmopt details to the  user, dont do aynthing else, just give the one and only refined prompt that user wants to have  :\n\n${prompt}`;

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      {
        inputs: refinedPrompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.9,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    let output = Array.isArray(response.data)
      ? response.data[0]?.generated_text?.replace(refinedPrompt, '').trim()
      : response.data.generated_text?.trim();

    // Post-process to strip common fluff
    output = output
      ?.replace(/^.*?(user|you)\s*(wants|should|can|need to)\b.*?:?/i, '') // remove weak phrasing
      .replace(/^\s*["']?|["']?\s*$/g, '') // remove outer quotes
      .trim();

    res.json({ enhanced: output || 'No result' });

  } catch (err) {
    console.error(
      'Hugging Face error:',
      err.response?.status,
      err.response?.data || err.message
    );
    res.status(500).json({ error: 'Failed to enhance prompt using Hugging Face.' });
  }
});

module.exports = router;
