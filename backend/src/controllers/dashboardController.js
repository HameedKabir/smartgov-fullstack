import { Issue } from "../models/Issue.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const baseMatch = req.user.role === "admin" ? {} : { reportedBy: req.user._id };

  const [statusSummary, recentIssues, totalIssues] = await Promise.all([
    Issue.aggregate([
      { $match: baseMatch },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Issue.find(baseMatch).sort({ createdAt: -1 }).limit(5),
    Issue.countDocuments(baseMatch),
  ]);

  const summary = {
    totalIssues,
    pending: 0,
    inReview: 0,
    resolved: 0,
    rejected: 0,
  };

  for (const item of statusSummary) {
    if (item._id === "Pending") {
      summary.pending = item.count;
    }
    if (item._id === "In Review") {
      summary.inReview = item.count;
    }
    if (item._id === "Resolved") {
      summary.resolved = item.count;
    }
    if (item._id === "Rejected") {
      summary.rejected = item.count;
    }
  }

  res.json({
    success: true,
    summary,
    recentIssues,
  });
});
