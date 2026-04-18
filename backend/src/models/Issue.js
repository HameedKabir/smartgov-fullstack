import mongoose from "mongoose";

const issueUpdateSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Review", "Resolved", "Rejected"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "internal"],
      default: "public",
    },
  },
  { timestamps: true },
);

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Review", "Resolved", "Rejected"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        default: "",
        trim: true,
      },
      city: {
        type: String,
        default: "",
        trim: true,
      },
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updates: {
      type: [issueUpdateSchema],
      default: [],
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Issue = mongoose.model("Issue", issueSchema);
