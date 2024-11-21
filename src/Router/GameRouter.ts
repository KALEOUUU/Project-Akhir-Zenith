import express from 'express'
import { getAllMenus, createMenu, updateMenu, deleteMenu, changePicture } from '../Controller/MenuController';
import { verifyAddMenu, verifyEditMenu } from '../Middleware/VerifyMenu';
import uploadFile from '../Middleware/MenuUpload';

const app = express()
app.use(express.json())

app.get('/', getAllMenus)
app.post('/', [verifyAddMenu], createMenu)
app.put('/:id', [verifyEditMenu], updateMenu)
app.put('/pic/:id/', [uploadFile.single("picture")], changePicture)
app.delete('/:id', deleteMenu)

export default app 