const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(cors({
    methods:['POST']
}));


require('dotenv').config();

//Brevo Endpoint
app.post('/api/create-contact', async (req, res) => {
  const userinfo = req.body;

  const options = {
    method: 'POST',
    url: 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    data: {
      attributes: {
        COUNTRY: userinfo.country,
        AGE: userinfo.age,
        NAME: userinfo.name,
        CHILDREN: userinfo.children,
      },
      updateEnabled: false,
      email: userinfo.email,
      templateId: 1,
      redirectionUrl: process.env.REACT_APP_URL,
      includeListIds: [2],
    },
  };

  try {
    const response = await axios(options);
    res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      const errorResponse = error.response.data;
      res.status(error.response.status).json({ message: errorResponse.message || 'Failed to create contact' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
