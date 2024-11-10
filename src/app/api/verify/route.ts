import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await User.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          msg: "User not found ",
        },
        { status: 404 }
      );
    }

    if (user.verifyCode !== code) {
      return Response.json(
        {
          success: false,
          msg: "verification code is invalid ",
        },
        { status: 422 }
      );
    }

    if (new Date(user.verifyCodeExpiry) < new Date()) {
      return Response.json(
        {
          success: false,
          msg: "verification code is expired ",
        },
        { status: 422 }
      );
    }

    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    return Response.json(
      {
        success: true,
        msg: "User verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        msg: "Internal server error",
      },
      { status: 500 }
    );
  }
}
