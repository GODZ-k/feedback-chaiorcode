import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { z } from "zod";
import { usernameSchema } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameSchema,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const payloadData = usernameQuerySchema.safeParse(queryParams);

    if (!payloadData.success) {
      const usernameError = payloadData.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          msg: "Please enter valid inpiut",
          usernameError,
        },
        { status: 400 }
      );
    }

    const { username } = payloadData.data;
    const user = await User.findOne({ username , isVerified:true });

    if (!user) {
      return Response.json(
        {
          success: false,

          msg: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        msg: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        msg: "Internal sever error",
        error,
      },
      {
        status: 500,
      }
    );
  }
}
