import { Router } from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addCollaborator,
  removeCollaborator,
  getCollaborators,
} from "../controllers/project.controller";
import { authenticate } from "../middlewares/auth";
import { validate, validateQuery } from "../middlewares/validate";
import {
  createProjectSchema,
  updateProjectSchema,
  addCollaboratorSchema,
  paginationSchema,
} from "../validators/schemas";

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects for the authenticated user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 */
router.get("/", validateQuery(paginationSchema), getProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a specific project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       404:
 *         description: Project not found
 */
router.get("/:id", getProject);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 */
router.post("/", validate(createProjectSchema), createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       403:
 *         description: Only owner can update
 *       404:
 *         description: Project not found
 */
router.put("/:id", validate(updateProjectSchema), updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       403:
 *         description: Only owner can delete
 *       404:
 *         description: Project not found
 */
router.delete("/:id", deleteProject);

/**
 * @swagger
 * /api/projects/{id}/collaborators:
 *   get:
 *     summary: Get all collaborators for a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Collaborators retrieved successfully
 */
router.get("/:id/collaborators", getCollaborators);

/**
 * @swagger
 * /api/projects/{id}/collaborators:
 *   post:
 *     summary: Add a collaborator to a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Collaborator added successfully
 *       403:
 *         description: Only owner can add collaborators
 */
router.post(
  "/:id/collaborators",
  validate(addCollaboratorSchema),
  addCollaborator
);

/**
 * @swagger
 * /api/projects/{id}/collaborators/{userId}:
 *   delete:
 *     summary: Remove a collaborator from a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Collaborator removed successfully
 *       403:
 *         description: Only owner can remove collaborators
 */
router.delete("/:id/collaborators/:userId", removeCollaborator);

export default router;
