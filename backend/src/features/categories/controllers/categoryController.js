import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../services/categoryService.js';

export const getAllCategories = async (_req, res, next) => {
  try {
    const categories = await getCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const createNewCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await createCategory({ name, description });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateExistingCategory = async (req, res, next) => {
  try {
    const existingCategory = await getCategoryById(req.params.id);
    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const category = await updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const removeCategory = async (req, res, next) => {
  try {
    const existingCategory = await getCategoryById(req.params.id);
    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const category = await deleteCategory(req.params.id);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};
