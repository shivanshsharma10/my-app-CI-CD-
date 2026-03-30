const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from my CI/CD pipeline with jenkins yup 2!');
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});