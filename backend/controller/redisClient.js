const redis = require('redis');

const client = redis.createClient({
  url: 'redis://localhost:6379', // Sesuaikan dengan konfigurasi Redis Anda
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Reconnect attempt: ${retries}`);
      return Math.min(retries * 100, 3000); // misal delay bertambah hingga 3 detik
    },
  },
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

(async () => {
  try {
    await client.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

module.exports = client;
