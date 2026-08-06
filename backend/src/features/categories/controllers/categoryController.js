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
    res.json(categories);
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
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const createNewCategory = async (req, res, next) => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export const updateExistingCategory = async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

export const removeCategory = async (req, res, next) => {
  try {
    const category = await deleteCategory(req.params.id);
    res.json(category);
  } catch (error) {
    next(error);
  }
};
