import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { pages } from "next/dist/build/templates/app-page";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "Credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await User.findOne({
            $or: [
              { username: credentials.identifier },
              { email: credentials.identifier },
            ],
          });
          if (user) {
            if(!user.isVerified){
                throw new Error("Please verify your account first");
            }else{
                const isPasswordValid = await bcrypt.compare(credentials.password,user.password)

                if(!isPasswordValid){
                    throw new Error("Invalid password");
                }else{
                    return user;
                }
            }
          } else {
            throw new Error("User not found with this email");
          }
        } catch (error:any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks:{
    async session({ session, token }) {
        if(token){
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
        }
        return session
    },
    async jwt({ token, user }) {
        if(user){
            token._id = user._id?.toString()
            token.isVerified = user.isVerified
            token.isAcceptingMessages = user.isAcceptingMessages
            token.username = user.username
        }
        return token
    }
  },
  pages: {
    signIn: '/sign -in',
  },
  session:{
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET

};
