import mongoose from "mongoose";


type ConnectionObject = {
    isConnected ?: number
}

const connection:ConnectionObject = {}


async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Database is already connected");
        return
    }else{
        await mongoose.connect(`${process.env.DATABASE_CONNECTION_URL}/${process.env.DATABASE_NAME}`).then((response)=>{
            connection.isConnected = response.connections[0].readyState
            console.log(response.connection)
            console.log(`Database is connected successfully on host ${response.connection.host}`);
        }).catch((error)=>{
            console.log('failed to connect database ', error);
            process.exit(1)
            
        })
    }
}

export default dbConnect