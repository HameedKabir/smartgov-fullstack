import { Issue } from "../models/Issue.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const buildIssueImageUrl = (req) =>
  req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "";

const formatIssueForFrontend = (issue) => ({
  id: issue._id,
  title: issue.title,
  description: issue.description,
  category: issue.category,
  status: issue.status,
  priority: issue.priority,
  image: issue.imageUrl,
  imageUrl: issue.imageUrl,
  lat: issue.location.lat,
  lng: issue.location.lng,
  address: issue.location.address,
  city: issue.location.city,
  createdAt: issue.createdAt,
  updatedAt: issue.updatedAt,
  resolvedAt: issue.resolvedAt,
  reportedBy: issue.reportedBy,
  assignedTo: issue.assignedTo,
  updates: issue.updates,
});

export const createIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category || "General",
    priority: req.body.priority || "Medium",
    imageUrl: buildIssueImageUrl(req),
    location: {
      lat: Number(req.body.lat),
      lng: Number(req.body.lng),
      address: req.body.address || "",
      city: req.body.city || req.user.city || "",
    },
    reportedBy: req.user._id,
    updates: [
      {
        message: "Issue created and awaiting review",
        status: "Pending",
        createdBy: req.user._id,
        visibility: "public",
      },
    ],
  });

  const populated = await issue.populate([
    { path: "reportedBy", select: "name email city role" },
    { path: "assignedTo", select: "name email role" },
    { path: "updates.createdBy", select: "name role" },
  ]);

  res.status(201).json({
    success: true,
    message: "Issue submitted successfully",
    issue: formatIssueForFrontend(populated),
  });
});

export const getIssues = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const skip = (page - 1) * limit;

  const filters = {};

  if (req.query.status) {
    filters.status = req.query.status;
  }

  if (req.query.category) {
    filters.category = req.query.category;
  }

  if (req.query.search) {
    filters.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
      { "location.city": { $regex: req.query.search, $options: "i" } },
    ];
  }

  if (req.user.role === "user") {
    filters.reportedBy = req.user._id;
  }

  const [issues, total] = await Promise.all([
    Issue.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("reportedBy", "name email city role")
      .populate("assignedTo", "name email role"),
    Issue.countDocuments(filters),
  ]);

  const formattedIssues = issues.map(formatIssueForFrontend);

  if (req.query.includeMeta === "true") {
    res.json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: formattedIssues,
    });
    return;
  }

  res.set("X-Total-Count", String(total));
  res.set("X-Page", String(page));
  res.set("X-Limit", String(limit));
  res.json(formattedIssues);
});

export const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.issueId)
    .populate("reportedBy", "name email city role")
    .populate("assignedTo", "name email role")
    .populate("updates.createdBy", "name role");

  if (!issue) {
    throw new ApiError(404, "Issue not found");
  }

  if (req.user.role === "user" && issue.reportedBy._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only view issues you reported");
  }

  res.json(formatIssueForFrontend(issue));
});

export const updateIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.issueId);

  if (!issue) {
    throw new ApiError(404, "Issue not found");
  }

  const isOwner = issue.reportedBy.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You do not have permission to update this issue");
  }

  const updates = ["title", "description", "category", "priority", "status", "assignedTo"];
  for (const field of updates) {
    if (req.body[field] !== undefined) {
      issue[field] = req.body[field];
    }
  }

  if (req.body.status === "Resolved" && !issue.resolvedAt) {
    issue.resolvedAt = new Date();
  }

  if (req.body.assignedTo) {
    const assignee = await User.findById(req.body.assignedTo);
    if (!assignee) {
      throw new ApiError(404, "Assigned user not found");
    }
  }

  issue.updates.push({
    message: req.body.status
      ? `Issue updated. Current status: ${req.body.status}`
      : "Issue record updated",
    status: req.body.status || issue.status,
    createdBy: req.user._id,
    visibility: "internal",
  });

  await issue.save();

  const populated = await issue.populate([
    { path: "reportedBy", select: "name email city role" },
    { path: "assignedTo", select: "name email role" },
    { path: "updates.createdBy", select: "name role" },
  ]);

  res.json({
    success: true,
    message: "Issue updated successfully",
    issue: formatIssueForFrontend(populated),
  });
});

export const updateIssueStatus = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.issueId);

  if (!issue) {
    throw new ApiError(404, "Issue not found");
  }

  issue.status = req.body.status;
  issue.resolvedAt = req.body.status === "Resolved" ? new Date() : null;
  issue.updates.push({
    message: req.body.message || `Status changed to ${req.body.status}`,
    status: req.body.status,
    createdBy: req.user._id,
    visibility: "public",
  });

  await issue.save();

  const populated = await issue.populate([
    { path: "reportedBy", select: "name email city role" },
    { path: "assignedTo", select: "name email role" },
    { path: "updates.createdBy", select: "name role" },
  ]);

  res.json({
    success: true,
    message: "Issue status updated successfully",
    issue: formatIssueForFrontend(populated),
  });
});

export const addIssueUpdate = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.issueId);

  if (!issue) {
    throw new ApiError(404, "Issue not found");
  }

  issue.updates.push({
    message: req.body.message,
    status: req.body.status || issue.status,
    createdBy: req.user._id,
    visibility: req.body.visibility || "public",
  });

  if (req.body.status) {
    issue.status = req.body.status;
    issue.resolvedAt = req.body.status === "Resolved" ? new Date() : issue.resolvedAt;
  }

  await issue.save();

  const populated = await issue.populate("updates.createdBy", "name role");

  res.status(201).json({
    success: true,
    message: "Issue update added successfully",
    updates: populated.updates,
  });
});
