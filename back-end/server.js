require('dotenv').config();
const express = require('express');
const cors = require('cors');
const enhanceRoutes = require('./routes/enhance');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/enhance', enhanceRoutes);

app.listen(PORT, () => {
  console.log(`🌊 Server running on port ${PORT}`);
});
    
