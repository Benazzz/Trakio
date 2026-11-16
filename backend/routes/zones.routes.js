import express from "express";
import * as zoneController from "../controllers/zones.controller.js";
const zonesRouter = express.Router();

zonesRouter.get("/", zoneController.getZones);
export default zonesRouter;