import  ImageKit from 'imagekit'
import { ENV } from './env.js'
import multer from 'multer'

const storage = multer.memoryStorage()

export const upload = multer({storage:storage})

export const imagekit = new ImageKit({
    publicKey:ENV.IMAGEKITE_PUBLIC_KEY,
    privateKey:ENV.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint:ENV.URL_ENDPOINT
})