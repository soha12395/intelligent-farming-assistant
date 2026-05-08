const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const farmRoutes = require('./routes/farm');
const diseaseRoutes = require('./routes/disease');
const cropRoutes = require('./routes/crop');

app.use('/api/auth', authRoutes);
app.use('/api/farm', farmRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/crop', cropRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});