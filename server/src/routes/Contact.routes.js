import express from "express";
import {
  addContactRequest,
  deleteContact,
  getContact,
  getContacts,
  getIncomingRequests,
  getSentRequests,
  getUser,
  getUsers,
  respondToContactRequest,
  updateContact,
} from "../controllers/Contact.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  respondToContactRequestSchema,
  updateContactSchema,
} from "@connecto/shared/validations";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/users", requireAuth, getUsers);
router.get("/user/:id", requireAuth, getUser);

router.post("/request", requireAuth, addContactRequest);
router.patch(
  "/respond/:contactUserId",
  requireAuth,
  validate(respondToContactRequestSchema),
  respondToContactRequest
);
router.get("/request/incoming", requireAuth, getIncomingRequests);
router.get("/request/sent", requireAuth, getSentRequests);
router.get("/", requireAuth, getContacts);
router.get("/:contactUserId", requireAuth, getContact);
router.patch(
  "/update/:id",
  requireAuth,
  validate(updateContactSchema),
  updateContact
);
router.delete("/delete/:contactUserId", requireAuth, deleteContact);

export default router;
