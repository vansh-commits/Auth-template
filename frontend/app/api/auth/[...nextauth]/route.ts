// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers: { GET, POST }, auth} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // (optional) profile(p) { return { id: p.sub, email: p.email, name: p.name, image: p.picture } }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      // First sign-in: copy safe fields from Google
      if (account && profile) {
        token.provider = account.provider;                   // "google"
        token.providerAccountId = account.providerAccountId; // Google "sub"
        token.email = (profile as any).email;
        token.name = (profile as any).name;
        token.picture = (profile as any).picture;
        token.email_verified = (profile as any).email_verified ?? false;

        // OPTIONAL: immediately sync to Go and switch token.sub to *your* user id
        try {
          const res = await fetch(`${process.env.API_BASE}/internal/sso-sync`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-internal-token": process.env.INTERNAL_SYNC_TOKEN!
            },
            body: JSON.stringify({
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              email: (profile as any).email,
              name: (profile as any).name,
              avatarUrl: (profile as any).picture,
              emailVerified: (profile as any).email_verified ?? false
            })
          });
          const data = await res.json().catch(() => ({}));
          if (data?.userId) token.sub = data.userId; // now session.user.id is *your* DB id
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      // What the client can see
      (session.user as any).id = token.sub as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET
});
