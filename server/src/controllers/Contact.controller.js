import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { Contact } from "../models/Contact.model.js";
import { User } from "../models/User.model.js";
import {
  badRequestError,
  conflictError,
  notFoundError,
} from "../utils/errors.js";

export const addContactRequest = asyncHandler(async (req, res) => {
  const { contactUserId } = req.body;
  const userId = req.user._id.toString();

  if (!contactUserId) {
    throw badRequestError("Contact user id is required");
  }

  if (!mongoose.Types.ObjectId.isValid(contactUserId)) {
    throw badRequestError("Invalid contact user id");
  }

  if (userId === contactUserId) {
    throw badRequestError("Can't add yourself as contact");
  }

  const contactUser = await User.findById(contactUserId);
  if (!contactUser) {
    throw notFoundError("User not found");
  }

  const existing = await Contact.findOne({
    userId: userId,
    contactId: contactUserId,
  });

  if (existing) {
    if (existing.status === "blocked") {
      throw badRequestError("User is blocked");
    }
    if (existing.status === "pending") {
      throw conflictError(
        existing.initiatedBy === userId
          ? "Request already sent"
          : "Contact request pending your response"
      );
    }
    if (existing.status === "accepted") {
      throw conflictError("Already contacts");
    }
  }

  await Contact.insertMany([
    {
      userId: userId,
      contactId: contactUserId,
      initiatedBy: userId,
      status: "pending",
    },
    {
      userId: contactUserId,
      contactId: userId,
      initiatedBy: userId,
      status: "pending",
    },
  ]);

  res.status(201).json({
    message: "Contact request sent",
    contactUserId,
  });
});

export const respondToContactRequest = asyncHandler(async (req, res) => {
  const { contactUserId } = req.params;
  const { action } = req.body; // 'accepted' or 'blocked'
  const userId = req.user._id.toString();

  if (!mongoose.Types.ObjectId.isValid(contactUserId)) {
    throw badRequestError("Invalid contact user id");
  }

  const contactRequest = await Contact.findOne({
    userId: userId,
    contactId: contactUserId,
    initiatedBy: contactUserId,
    status: "pending",
  });

  if (!contactRequest) {
    throw notFoundError("Contact request not found");
  }

  if (action === "accepted") {
    await Contact.updateMany(
      {
        $or: [
          { userId: userId, contactId: contactUserId },
          { userId: contactUserId, contactId: userId },
        ],
      },
      { status: "accepted", addedAt: new Date() }
    );
  } else if (action === "blocked") {
    await Contact.findOneAndUpdate(
      { userId: userId, contactId: contactUserId },
      { status: action }
    );
  }

  res.json({ message: `Contact request ${action}` });
});

export const getIncomingRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const requests = await Contact.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: "pending",
        initiatedBy: { $ne: new mongoose.Types.ObjectId(userId) },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "contactId",
        foreignField: "_id",
        as: "contactUser",
      },
    },
    {
      $unwind: "$contactUser",
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        contactId: 1,
        status: 1,
        initiatedBy: 1,
        createdAt: 1,
        contactUser: {
          username: 1,
          email: 1,
          avatar: 1,
          lastSeen: 1,
          createdAt: 1,
        },
      },
    },
  ]);

  res.json({ requests });
});

export const getSentRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const requests = await Contact.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: "pending",
        initiatedBy: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "contactId",
        foreignField: "_id",
        as: "contactUser",
      },
    },
    {
      $unwind: "$contactUser",
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        contactId: 1,
        status: 1,
        initiatedBy: 1,
        createdAt: 1,
        contactUser: {
          username: 1,
          email: 1,
          avatar: 1,
          lastSeen: 1,
          createdAt: 1,
        },
      },
    },
  ]);

  res.json({ requests });
});

export const getContacts = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const { query } = req.query;

  const contacts = await Contact.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        status: "accepted",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "contactId",
        foreignField: "_id",
        as: "contactUser",
      },
    },
    {
      $unwind: "$contactUser",
    },
    ...(query
      ? [
          {
            $match: {
              $or: [
                { "contactUser.username": { $regex: query, $options: "i" } },
                { "contactUser.email": { $regex: query, $options: "i" } },
              ],
            },
          },
        ]
      : []),
    {
      $sort: { isFavorite: -1, addedAt: -1 },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        contactId: 1,
        status: 1,
        initiatedBy: 1,
        addedAt: 1,
        nickname: 1,
        isFavorite: 1,
        contactUser: {
          username: 1,
          email: 1,
          avatar: 1,
          lastSeen: 1,
          createdAt: 1,
        },
      },
    },
  ]);

  res.json({ contacts });
});

export const getContact = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const { contactUserId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactUserId)) {
    throw badRequestError("Invalid contact ID");
  }

  const contacts = await Contact.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        contactId: new mongoose.Types.ObjectId(contactUserId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "contactId",
        foreignField: "_id",
        as: "contactUser",
      },
    },
    {
      $unwind: "$contactUser",
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        contactId: 1,
        status: 1,
        initiatedBy: 1,
        addedAt: 1,
        nickname: 1,
        isFavorite: 1,
        contactUser: {
          username: 1,
          email: 1,
          avatar: 1,
          lastSeen: 1,
          createdAt: 1,
        },
      },
    },
  ]);

  if (!contacts.length) {
    throw notFoundError("Contact not found");
  }

  res.json({ contact: contacts[0] });
});

export const updateContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nickname, isFavorite } = req.body;
  const userId = req.user._id.toString();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw badRequestError("Invalid contact ID");
  }

  if (!nickname && (isFavorite === undefined || isFavorite === null)) {
    throw badRequestError("There is nothing to update");
  }

  const contact = await Contact.findOneAndUpdate(
    {
      _id: id,
      userId: userId,
      status: "accepted",
    },
    {
      ...(nickname !== undefined && { nickname }),
      ...(isFavorite !== undefined && { isFavorite }),
    },
    { new: true }
  ).populate("contactId", "username email avatar lastSeen");

  if (!contact) {
    throw notFoundError("Contact not found");
  }

  res.json({ contact, message: "Contact updated" });
});

export const deleteContact = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const { contactUserId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactUserId)) {
    throw badRequestError("Invalid contact user id");
  }

  const result = await Contact.deleteMany({
    $or: [
      { userId: userId, contactId: contactUserId },
      { userId: contactUserId, contactId: userId },
    ],
  });

  if (result.deletedCount === 0) {
    throw notFoundError("Contact not found");
  }

  res.json({ message: "Contact removed" });
});

export const getUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();
  const { query } = req.query;

  let filter = {
    _id: { $ne: userId },
  };

  if (query) {
    filter.$or = [
      { username: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }

  const users = await User.find({
    ...filter,
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("username email avatar createdAt");

  res.json({ users });
});

export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw badRequestError("Invalid user ID");
  }

  const user = await User.findOne({ _id: id }).select(
    "username email avatar createdAt"
  );

  if (!user) {
    throw notFoundError("User not found");
  }

  res.json({ user });
});
