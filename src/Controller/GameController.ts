import { Request, Response } from "express"; 
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../global";
import fs from "fs"


const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllGames = async (req: Request, res: Response) => {
    try {
        const { search } = req.query //input
        const allMenus = await prisma.game.findMany({                 
            where: { name: { contains: search?.toString() || "" } }    
        })                                                             
        return res.json({ //output                
            status: true,
            data: allMenus,
            massege: 'Menu has retrieved'
        }).status(200)
    } catch (error) {
        return res
            .json({
                status: false,
                message: `Error ${error}`
            })
            .status(400)
    }
}

export const createGame = async (req: Request, res: Response) => {
    try {
        //mengambil data
        const { name, price, category, description } = req.body
        const uuid = uuidv4()

        //proses save data
        const newMenu = await prisma.game.create({
            data: { uuid, name, price: Number(price), category, description }
        })

        return res.json({
            status: 'Success',
            data: newMenu,
            message: 'New menu has created'
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

export const updateMenu = async (request: Request, response: Response) =>{
    try {
        const { id } = request.params 
        const { name, price, category, description } = request.body 

        const findMenu = await prisma.menu.findFirst ({where: { id: Number(id)}})
        if  (!findMenu) return response 
            .status(200)
            .json({status: false, message : 'Menu Is Not Found'})

        const updatedMenu = await prisma.menu.update({

            data: {
                name: name || findMenu.name,
                price: price ? Number(price) : findMenu.price,
                category: category || findMenu.category,
                description: description || findMenu.description
            },
            where: {id: Number(id)}
    })
        return response.json({
            status : true,
            data : updatedMenu,
            message: "Menu has update"
        }).status(200)
} catch (error){
   return response.json({
    status : false,
    message: 'There is an error. ${error}'
   }) 
   .status(400)
}}


export const deleteMenu = async (req: Request, res: Response) => {
    try {
        const { id } = req.params //Memilih id dari menu yang ingin di hapus melalui parameter

        // Mencari menu berdasarkan id
        const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } });
        if (!findMenu) {
            return res.status(404).json({
                status: 'error lee',
                message: "Menu tidak ditemukan"
            });
        }

        // Menghapus menu
        await prisma.menu.delete({
            where: { id: Number(id) }
        });

        return res.json({
            status: 'Alhamdulillah ga error',
            message: 'Menu telah dihapus'
        }).status(200);
    } catch (error) {
        return res
            .json({
                status: false,
                message: `Error saat menghapus menu ${error}`
            })
            .status(400);
    }
}

export const changePicture = async (request: Request, response: Response) => {
    try {
        const { id } = request.params //Memilih id dari menu yang ingin di hapus melalui parameter

        const findMenu = await prisma.menu.findFirst({ where: { id: Number(id) } });
        if (!findMenu)
            return response.status(404).json({
                status: 'error lee',
                message: "Menu tidak ditemukan"
            });
            let filename = findMenu.picture
            if(request.file) {
                filename = request.file.filename
                let path = `${BASE_URL}/../public/menu-picture/${findMenu.picture}`
                let exist = fs.existsSync(path)
                if (exist && findMenu.picture !== ``) fs.unlinkSync(path)
            }

        const updatePicture = await prisma.menu.update({
            data: {picture: filename},
            where: {id: Number(id)}
        })

        return response.json({
            status: true,
            data: updatePicture,
            message: "Gambar uda berubah"
        }).status(404)

    } catch (error){
        return response.json({
            status: false,
            message: `error bang, ${error}`
        }).status(400)
    }
}