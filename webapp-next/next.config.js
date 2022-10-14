module.exports = {
  images: {
    domains: [
      'yt3.ggpht.com',
      'pbs.twimg.com',
      'xx.fbcdn.net',
    ],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ENV: process.env.ENV,
    APPSYNC_API_ID: process.env.APPSYNC_API_ID,
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    TWITTER_API_SECRET: process.env.TWITTER_API_SECRET,
  }
}