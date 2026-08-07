import { createTag, deleteTag, getTagById, getTags, updateTag } from '../services/tags.service.js';

export const getAllTags = async (_req, res, next) => {
  try {
    const tags = await getTags();
    res.status(200).json({ success: true, data: tags });
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
    res.status(200).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};

export const createNewTag = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    const tag = await createTag({ name });
    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};

export const updateExistingTag = async (req, res, next) => {
  try {
    const existingTag = await getTagById(req.params.id);
    if (!existingTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const tag = await updateTag(req.params.id, req.body);
    res.status(200).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};

export const removeTag = async (req, res, next) => {
  try {
    const existingTag = await getTagById(req.params.id);
    if (!existingTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const tag = await deleteTag(req.params.id);
    res.status(200).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};
