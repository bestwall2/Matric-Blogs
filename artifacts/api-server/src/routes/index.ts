import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import categoriesRouter from "./categories";
import newsletterRouter from "./newsletter";
import aiRouter from "./ai";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(postsRouter);
router.use(categoriesRouter);
router.use(newsletterRouter);
router.use(aiRouter);
router.use(uploadRouter);

export default router;
