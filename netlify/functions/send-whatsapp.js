exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { phone, message } = JSON.parse(event.body || '{}');
  if (!phone || !message) {
    return { statusCode: 400, body: 'Missing phone or message' };
  }

  const idInstance = '7107594290';
  const apiToken = '866465d1a03b47838a2f4493f557d0e76d86e09dbea64553bc';

  const chatId = '212' + phone.replace(/^0/, '').replace(/\D/g, '') + '@c.us';

  const res = await fetch(
    `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message }),
    }
  );

  const data = await res.json();
  return {
    statusCode: res.ok ? 200 : 500,
    body: JSON.stringify(data),
  };
};
