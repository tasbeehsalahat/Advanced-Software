// HomeController.js

const request = require('request');

function searchByTerm(req, res) {
  const { source, country, values } = req.body;
  const options = {
    method: 'POST',
    url: 'https://price-analytics.p.rapidapi.com/search-by-term',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '0f376ee3a1msh35eb8d384d222e9p136bb8jsncaa1998c71f8',
      'X-RapidAPI-Host': 'price-analytics.p.rapidapi.com'
    },
    form: {
      source,
      country,
      values
    }
  };

  request(options, function (error, response, body) {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(response.statusCode).json(body);
  });
}
function getItem(req, res) {
    const jobId = req.body.jobId;
    const options = {
      method: 'GET',
      url: `https://price-analytics.p.rapidapi.com/poll-job/${jobId}`,
      headers: {
        'X-RapidAPI-Key': '0f376ee3a1msh35eb8d384d222e9p136bb8jsncaa1998c71f8',
        'X-RapidAPI-Host': 'price-analytics.p.rapidapi.com'
      }
    };
  
    request(options, function (error, response, body) {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      // Parse the JSON response
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(body);
      } catch (parseError) {
        return res.status(500).json({ error: 'Failed to parse JSON response' });
      }
      // Format the JSON with indentation for readability
      const formattedJson = JSON.stringify(jsonResponse, null, 2);
      // Send the formatted JSON response
      res.status(response.statusCode).send(formattedJson);
    });
  }

module.exports = {
  searchByTerm,
  getItem
};
