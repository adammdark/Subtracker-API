import { Router } from "express";
import { setReminders } from "../controllers/workflowController.js";

const workflowRouter = Router();

workflowRouter.post('/subscription/reminder',setReminders);

export default workflowRouter;
