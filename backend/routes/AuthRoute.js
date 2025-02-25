import { Router } from 'express';
import AuthController from '../controller/Auth.js'; // Import the default export as AuthController
import verifyToken from '../middleware/verifyToken.js'; // Import verifyToken middleware

const router = Router();

router.put("/update/:userId", verifyToken, AuthController.updateUserProfile);
router.delete("/delete/:userId", verifyToken, AuthController.deleteUser);
router.post('/signout', verifyToken, AuthController.signout);
router.get('/getUsers', AuthController.getUser);

export default router;