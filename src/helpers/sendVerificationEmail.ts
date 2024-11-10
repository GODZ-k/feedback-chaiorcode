import { resend } from "@/lib/resend";
import { VerificationEmailTemplate } from "../../emails/VerificationEmail";
import { ApiResponse } from "@/Types/ApiResponse";


export async function SendVerificationEmail(email:string,username:string,verifyCode:string):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Verification your account',
            react: VerificationEmailTemplate({ username ,otp:verifyCode }),
        });       
        
        return {
            success:true,
            message:"Verification email send successfully",
        }

    } catch (error) {
        console.log("failed to send email", error)
        return {
            success:false,
            message:"Failed to send email"
        }
    }
  };