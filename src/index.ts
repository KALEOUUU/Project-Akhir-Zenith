import express from 'express';
import cors from 'cors';
import MenuRoute from './Router/MenuRouter';
import UserRouter from './Router/UserRouter'


const PORT: number = 4000
const app = express()
app.use(cors())

app.use('/menu', MenuRoute)
app.use('/user', UserRouter)


app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})
