import AppDocument from "../models/AppDocument.js";
import Announcement from "../models/Announcement.js";
import ContactQuery from "../models/ContactQuery.js";

// -- Documents --
export const getDocuments = async (req, res) => {
  try {
    const docs = await AppDocument.find().sort({ uploadDate: -1 });
    // Don't send the full fileUrl (base64) when listing to save bandwidth, unless needed.
    // However, the frontend might need it to download. We'll send it all for simplicity, 
    // or maybe we should omit `fileUrl` in the list and only fetch it when requested?
    // Let's just send all since there might not be many.
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents" });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { category, subCategory } = req.body;
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const base64Content = req.file.buffer.toString("base64");
    const fileUrl = `data:${req.file.mimetype};base64,${base64Content}`;
    const fileName = req.file.originalname;

    // Check if duplicate (category + subCategory)
    let doc = await AppDocument.findOne({ category, subCategory });

    if (doc) {
      // Replace existing
      doc.fileUrl = fileUrl;
      doc.fileName = fileName;
      doc.uploadDate = new Date();
      await doc.save();
      res.status(200).json({ message: "Document updated successfully", doc });
    } else {
      // Create new
      doc = new AppDocument({
        category,
        subCategory,
        fileName,
        fileUrl,
        title: subCategory, // For backward compatibility/listing
        description: `Official document for ${subCategory}`
      });
      await doc.save();
      res.status(201).json({ message: "Document uploaded successfully", doc });
    }
  } catch (error) {
    res.status(500).json({ message: "Error uploading document", error: error.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const updateData = { title, description, category };
    
    if (req.file) {
      updateData.fileName = req.file.originalname;
      const base64Content = req.file.buffer.toString("base64");
      updateData.fileUrl = `data:${req.file.mimetype};base64,${base64Content}`;
    }

    const doc = await AppDocument.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.json({ message: "Document updated successfully", doc });
  } catch (error) {
    res.status(500).json({ message: "Error updating document" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const doc = await AppDocument.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting document" });
  }
};

// -- Announcements --
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching announcements" });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;
    const ann = new Announcement({ title, description });
    await ann.save();
    res.status(201).json({ message: "Announcement created", ann });
  } catch (error) {
    res.status(500).json({ message: "Error creating announcement" });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;
    const ann = await Announcement.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
    if (!ann) return res.status(404).json({ message: "Announcement not found" });
    res.json({ message: "Announcement updated", ann });
  } catch (error) {
    res.status(500).json({ message: "Error updating announcement" });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.findByIdAndDelete(req.params.id);
    if (!ann) return res.status(404).json({ message: "Announcement not found" });
    res.json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting announcement" });
  }
};

// -- Contact Queries --
export const getQueries = async (req, res) => {
  try {
    const queries = await ContactQuery.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching queries" });
  }
};

export const replyToQuery = async (req, res) => {
  try {
    const { response } = req.body;
    const query = await ContactQuery.findByIdAndUpdate(
      req.params.id, 
      { reply: response, status: "Replied" },
      { new: true }
    );
    if (!query) return res.status(404).json({ message: "Query not found" });
    res.json({ message: "Query resolved", query });
  } catch (error) {
    res.status(500).json({ message: "Error replying to query" });
  }
};
