import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  site: process.env.NEXTAUTH_URL,
  providers: [
    TwitterProvider({
      clientId: 'dTAwRDBqOFl3ZmpkOGw4RmpIT1c6MTpjaQ', //process.env.TWITTER_CONSUMER_KEY,
      clientSecret: 'FaIS5ICp0qvbrRO30zSvngjZLyVU8VEY4V0lsklrsvu0CkK384', //process.env.TWITTER_CONSUMER_SECRET,
      version: "2.0",
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log(token)
      // console.log(user)
      // console.log(account)
      // console.log(profile)

      if (account !== undefined) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expires = new Date(new Date() + (1000 * account.expires_at)),
        token.profileName = profile.data.username;
        token.id = profile.data.id;
      }
      
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expires = token.expires,
      session.profileName = token.profileName;
      session.id = token.id;
      return session;
    }
  },
});