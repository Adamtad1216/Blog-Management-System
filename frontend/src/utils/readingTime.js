/**
 * Calculates reading time in minutes based on text content
 * @param {string} content - The blog post content
 * @param {number} wordsPerMinute - Average reading speed (default 200)
 * @returns {string} Formatted reading time string (e.g., "3 min read")
 */
export const calculateReadingTime = (content = '', wordsPerMinute = 200) => {
  if (!content || typeof content !== 'string') {
    return '1 min read';
  }

  // Strip HTML tags if any
  const cleanText = content.replace(/<[^>]*>/g, ' ').trim();
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return `${Math.max(1, minutes)} min read`;
};

export const formatWordCount = (content = '') => {
  if (!content || typeof content !== 'string') return 0;
  return content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
};
