import { Message } from "@/models/user.model"

export interface ApiResponse {
    success:boolean;
    message:string;
    messages?:Array<Message>;
    isAcceptingMessage?:boolean;
}