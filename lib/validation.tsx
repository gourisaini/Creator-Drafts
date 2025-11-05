export const VALIDATION_RULES = {
  title: {
    minLength: 3,
    maxLength: 200,
  },
  description: {
    minLength: 10,
    maxLength: 2000,
  },
  tags: {
    maxCount: 10,
    maxLength: 50,
  },
  images: {
    maxCount: 5,
    maxSizeMB: 10,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
};

export function validateTitle(title: string): {
  valid: boolean;
  error?: string;
} {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: "Title is required" };
  }
  if (title.length < VALIDATION_RULES.title.minLength) {
    return {
      valid: false,
      error: `Title must be at least ${VALIDATION_RULES.title.minLength} characters`,
    };
  }
  if (title.length > VALIDATION_RULES.title.maxLength) {
    return {
      valid: false,
      error: `Title must not exceed ${VALIDATION_RULES.title.maxLength} characters`,
    };
  }
  return { valid: true };
}

export function validateDescription(desc: string): {
  valid: boolean;
  error?: string;
} {
  if (!desc || desc.trim().length === 0) {
    return { valid: false, error: "Description is required" };
  }
  if (desc.length < VALIDATION_RULES.description.minLength) {
    return {
      valid: false,
      error: `Description must be at least ${VALIDATION_RULES.description.minLength} characters`,
    };
  }
  if (desc.length > VALIDATION_RULES.description.maxLength) {
    return {
      valid: false,
      error: `Description must not exceed ${VALIDATION_RULES.description.maxLength} characters`,
    };
  }
  return { valid: true };
}

export function validateImages(images: string[]): {
  valid: boolean;
  error?: string;
} {
  if (images.length > VALIDATION_RULES.images.maxCount) {
    return {
      valid: false,
      error: `Maximum ${VALIDATION_RULES.images.maxCount} images allowed`,
    };
  }
  return { valid: true };
}

export function validateTags(tags: string[]): {
  valid: boolean;
  error?: string;
} {
  if (tags.length > VALIDATION_RULES.tags.maxCount) {
    return {
      valid: false,
      error: `Maximum ${VALIDATION_RULES.tags.maxCount} tags allowed`,
    };
  }

  for (const tag of tags) {
    if (tag.length > VALIDATION_RULES.tags.maxLength) {
      return {
        valid: false,
        error: `Each tag must not exceed ${VALIDATION_RULES.tags.maxLength} characters`,
      };
    }
  }

  return { valid: true };
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
