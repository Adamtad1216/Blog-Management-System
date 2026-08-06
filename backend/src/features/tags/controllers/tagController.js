import { createTag, deleteTag, getTagById, getTags, updateTag } from '../services/tagService.js';

export const getAllTags = async (_req, res, next) => {
  try {
    const tags = await getTags();
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

export const getTag = async (req, res, next) => {
  try {
    const tag = await getTagById(req.params.id);
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.json(tag);
  } catch (error) {
    next(error);
  }
};

export const createNewTag = async (req, res, next) => {
  try {
    const tag = await createTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    next(error);
  }
};

export const updateExistingTag = async (req, res, next) => {
  try {
    const tag = await updateTag(req.params.id, req.body);
    res.json(tag);
  } catch (error) {
    next(error);
  }
};

export const removeTag = async (req, res, next) => {
  try {
    const tag = await deleteTag(req.params.id);
    res.json(tag);
  } catch (error) {
    next(error);
  }
};
