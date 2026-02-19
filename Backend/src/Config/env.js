import { configDotenv } from "dotenv";

configDotenv({quiet:true})

export const ENV ={
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
IMAGEKITE_PUBLIC_KEY:process.env.IMAGEKITE_PUBLIC_KEY,
IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY,
URL_ENDPOINT:process.env.URL_ENDPOINT,
BREVO_MAIL:process.env.BREVO_MAIL,
BREVO_SMTP:process.env.BREVO_SMTP,
USER_MAIL:process.env.USER_MAIL,
CLIENT_URL:process.env.CLIENT_URL

}