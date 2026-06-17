import Category from "../models/Category.js";
import Specialty from "../models/Specialty.js";

export async function detectAI(input = "") {
  const text = input.toLowerCase();

  const categories = await Category.find();

  let matchedCategory = null;

  for (const cat of categories) {
    const found = cat.keywords.some(keyword =>
      text.includes(keyword.toLowerCase())
    );

    if (found) {
      matchedCategory = cat;
      break;
    }
  }

  if (!matchedCategory) {
    matchedCategory = categories[0];
  }

  const specialties = await Specialty.find({
    category: matchedCategory.name,
  });

  return {
    category: matchedCategory,
    specialties,
  };
}