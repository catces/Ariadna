import { Router } from "express";
import { registerUser,loginUser,deleteUser,getUser,deleteAllUsers } from "../controllers/authentication/authLogRes";
import { verifyToken } from "../middlewares/verifyToken";


const router = Router();

router.post('/auth/register',registerUser);
router.post('/login',loginUser);
router.get('/', getUser);
router.delete('/', deleteUser);
router.delete('/deleteall',deleteAllUsers)
// router.post('/', (req, res, next) => {
//     const prove = req.body;
//     console.log(prove);
//     res.send('It looks like POST is working')
// });

export default router;