import { Router } from "express";
import { getStatistics } from "../controllers/statistics.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/statistics:
 *   get:
 *     summary: Get user statistics and dashboard data
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_projects:
 *                       type: integer
 *                     owned_projects:
 *                       type: integer
 *                     collaborating_projects:
 *                       type: integer
 *                     total_tasks:
 *                       type: integer
 *                     tasks_by_status:
 *                       type: object
 *                       properties:
 *                         pending:
 *                           type: integer
 *                         in_progress:
 *                           type: integer
 *                         completed:
 *                           type: integer
 *                     tasks_assigned_to_me:
 *                       type: integer
 *                     tasks_created_by_me:
 *                       type: integer
 */
router.get("/", getStatistics);

export default router;
