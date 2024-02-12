import { register, login, changePassword } from "../controller/authController";


const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/change-password", changePassword);

export default router;