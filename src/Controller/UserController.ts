import { Request, Response } from "express"; 
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../global";
import fs from "fs"
import md5 from "md5"
import { SECRET } from "../global";
// import { Jwt } from "jsonwebtoken";


// const jwt = require('jsonwebtoken')
const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { search } = req.query //input
        const allUsers = await prisma.user.findMany({                 
            where: { username: { contains: search?.toString() || "" } }    
        })                                                             
        return res.json({ //output                
            status: true,
            data: allUsers,
            massege: 'User has Retrieved'
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: `Error CO${error}`
            })
            .status(400)
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        //mengambil data
        const { username, email, password, role } = req.body
        const uuid = uuidv4()

        //proses save data
        const newUser = await prisma.user.create({
            data: { uuid, username, email, role, password }
        })

        return res.json({
            status: 'Success',
            data: newUser,
            message: 'Orang Baru Sudah Ditambahkan'
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: `code error ${error}`
            })
            .status(400)
    }
}

export const updateUser = async (request: Request, response: Response) =>{
    try {
        const { id } = request.params 
        const { username, email, password, role } = request.body 

        const findUser = await prisma.user.findFirst ({
            where: { id: Number(id)},
        })
        if  (!findUser) return response 
            .status(200)
            .json({status: false, message : 'user Is Not Found'})

        const updatedUser = await prisma.user.update({

            data: {
                username: username || findUser.username,
                email: email || findUser.email,
                password: password || findUser.password,
                role: role || 'Cashier'
            },
            where: {id: Number(id)}
    })
        return response.json({
            status : true,
            data : updatedUser,
            message: "user has update"
        }).status(200)
} catch (error){
   return response.json({
    status : false,
    message: `There is an error. ${error}`
   }) 
   .status(400)
}}


export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params //Memilih id dari user yang ingin di hapus melalui parameter

        // Mencari user berdasarkan id
        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser) {
            return res.status(404).json({
                status: 'error lee',
                message: "user tidak ditemukan"
            });
        }

        // Menghapus user
        await prisma.user.delete({
            where: { id: Number(id) }
        });

        return res.json({
            status: 'Alhamdulillah ga error',
            message: 'User sudah hilang'
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `Error saat menghapus user ${error}`
            })
            .status(400);
    }
}

export const changePicture = async (request: Request, response: Response) => {
    try {
        const { id } = request.params //Memilih id dari user yang ingin di hapus melalui parameter

        const findUser = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!findUser)
            return response.status(404).json({
                status: 'error lee',
                message: "user tidak ditemukan"
            });
            let filename = findUser.profile
            if(request.file) {
                filename = request.file.filename
                let path = `${BASE_URL}/../public/user-picture/${findUser.profile_picture}`
                let exist = fs.existsSync(path)
                if (exist && findUser.profile_picture !== ``) fs.unlinkSync(path)
            }

        const updateprofile_Picture = await prisma.user.update({
            data: {profile_picture: filename},
            where: {id: Number(id)}
        })

        return response.json({
            status: true,
            data: updateprofile_Picture,
            message: "Gambar uda berubah"
        }).status(404)

    } catch (error){
        return response.json({
            status: false,
            message: `error bang, ${error}`
        }).status(400)
    }

}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findFirst({ where: { id: Number(id) } });
        if (!user)
            return res.status(404).json({
                status: "User tidak ditemukan"
            });

        return res.json({
            status: 'Nih',
            user: user,
            message: 'Detail User berhasil diambil'
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `Error: ${error}`
            })
            .status(400);
    }
}

export const authentication = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const findUSer = await prisma.user.findFirst({
            where: { email, password: md5(password) }
        })

        if (!findUSer)
            return res
                .status(200)
                .json({
                    status: 'gagal',
                    logged: false,
                    message: 'email or password is invalid'
                })

        let data = {
            id: findUSer.id,
            name: findUSer.name,
            email: findUSer.email,
            role: findUSer.role,
        }

        let playload = JSON.stringify(data) // MENYIAPKAN DATA YANG AKAN DIJADIKAN TOKEN

        let token = jwt.sign(playload, SECRET || "token") //UNTUK MENGGENERATE TOKEN (SIGN)

        return res
            .status(200)
            .json({
                status: 'tru',
                logged: 'tru',
                message: "Login Succes",
                token
            })

    } catch (error) {
        return res
            .json({
                status: 'fals',
                message: `error ${error}`
            })
            .status(400)
    }
}