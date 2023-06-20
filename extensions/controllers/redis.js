const redis = require('redis');
const client = redis.createClient({
  url:"rediss://red-chdugne4dad5gbgcugbg:a0bNMlqbCvGnTuqtIUkFoMqS0JRNaZJr@oregon-redis.render.com:6379"
  // port: 6379,
  // host: "rediss://red-chdugne4dad5gbgcugbg:a0bNMlqbCvGnTuqtIUkFoMqS0JRNaZJr@oregon-redis.render.com:6379",
  // host: "127.0.0.1"
});
module.exports = {client};
