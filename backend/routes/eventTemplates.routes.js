import express from "express";
import * as eventTemplateController from "../controllers/eventTemplates.controller.js";
const eventTemplatesRouter = express.Router();

eventTemplatesRouter.get("/", eventTemplateController.getEventTemplates);

export default eventTemplatesRouter;