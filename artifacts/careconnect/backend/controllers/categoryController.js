import Category from "../models/Category.js"; // 👈 Yeh import lazmi add karein
import { createAdminNotification } from "../utils/notificationHelper.js";

export const addCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    await createAdminNotification(`New categories have been suceessfully add: ${category.title}`, "add");
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await createAdminNotification(`Category '${category.title}' has been successfully updated`, "update");
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    await createAdminNotification(`Category '${category.title}' has been successfully deleted`, "delete");
    res.json({ message: "Category Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};