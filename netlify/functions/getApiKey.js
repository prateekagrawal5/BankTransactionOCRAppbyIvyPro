exports.handler = async () => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured in Netlify environment variables.' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ apiKey }),
  };
};
