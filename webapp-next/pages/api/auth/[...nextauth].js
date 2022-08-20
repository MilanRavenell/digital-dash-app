import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CONSUMER_KEY,
      clientSecret: process.env.TWITTER_CONSUMER_SECRET,
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account !== undefined) {
        token.oauth_token = account.oauth_token;
        token.oauth_token_secret = account.oauth_token_secret;
        token.profileName = profile.screen_name;
        token.id = profile.id;
      }
      
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.oauth_token = token.oauth_token;
      session.oauth_token_secret = token.oauth_token_secret;
      session.profileName = token.profileName;
      session.id = token.id;
      return session;
    }
  },
});