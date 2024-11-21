import express from 'express'
import { authentication, changePicture, createUser, deleteUser, updateUser, getAllUsers, getUserById } from '../Controller/UserController';
import { verifyUser, verifyEditUser } from '../Middleware/VerifyUser';
import uploadFile from '../Middleware/profileUpload';
import { verifyAuthtentication } from '../Middleware/UserValidation';

const app = express()
app.use(express.json())

app.get('/', getAllUsers)
app.post('/', [verifyUser], createUser)
app.delete('/:id', deleteUser)
app.get('/:id', getUserById)
app.put('/:id', [verifyEditUser], updateUser)
app.put('/pic/:id', [uploadFile.single("picture")], changePicture)
app.post('/login', [verifyAuthtentication], authentication)

export default app
