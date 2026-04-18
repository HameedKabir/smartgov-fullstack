import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    service: "smartgov-backend",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default router;
