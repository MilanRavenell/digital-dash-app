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
    FB_API_ID: process.env.FB_API_ID,
    FB_APP_SECRET: process.env.FB_APP_SECRET,
    GOOG_API_KEY: process.env.GOOG_API_KEY,
    GOOG_OAUTH_CLIENT_ID: process.env.GOOG_OAUTH_CLIENT_ID,
    GOOG_OAUTH_CLIENT_SECRET: process.env.GOOG_OAUTH_CLIENT_SECRET,
    ACCESS_KEY_ID_AWS: process.env.ACCESS_KEY_ID_AWS,
    SECRET_ACCESS_KEY_AWS: process.env.SECRET_ACCESS_KEY_AWS,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.html$/i,
      use: [
        options.defaultLoaders.babel,
        {
          loader: 'html-loader',
        },
      ]
    });

    return config;
  }
}