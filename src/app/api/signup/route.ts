import { SendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();

    const existingUserVerifiedByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already exists",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await User.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
        if(existingUserByEmail.isVerified){
            return Response.json(
                {
                  success: false,
                  message: "user already exists",
                },
                {
                  status: 400,
                }
              );
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            existingUserByEmail.password = hashedPassword
            existingUserByEmail.username = username
            existingUserByEmail.email = email
            existingUserByEmail.verifyCodeExpiry= expiryDate
            existingUserByEmail.verifyCode = verifyCode

            await existingUserByEmail.save()
        }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        verifyCodeExpiry: expiryDate,
        verifyCode,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });
      await user.save();
    }

    const emailResponse = await SendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Please verify your account",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error user sign up ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
