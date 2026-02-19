import jwt from 'jsonwebtoken'
import { ENV } from '../Config/env.js';
export const authMiddlware = async(req ,res, next)=>{
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                message:"Token not found"
            })
        }

        const decode = jwt.verify(token, ENV.JWT_SECRET)

        if(!decode){
            return res.status(401).json({
                message:"User not found"
            })
        }

        req.id = decode.userId
        next()

    } catch (error) {
        console.log(`error from authMiddleware, ${error}`)
        return res.status(500).json({
            message:"User not logged in"
        })
    }
}