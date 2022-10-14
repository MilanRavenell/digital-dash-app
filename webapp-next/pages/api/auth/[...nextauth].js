import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  site: process.env.NEXTAUTH_URL,
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_API_KEY,
      clientSecret: process.env.TWITTER_API_SECRET,
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
        token.expires = new Date(1000 * account.expires_at);
        token.profileName = profile.data.username;
        token.id = profile.data.id;
        token.profilePicUrl = profile.data.profile_image_url;
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
      session.profilePicUrl = token.profilePicUrl;
      return session;
    }
  },
});