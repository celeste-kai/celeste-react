// Controller validation utilities

export interface ControllerParams {
  prompt: string;
  provider: string;
  model: string;
}

export interface ValidationResult {
  isValid: boolean;
  trimmedPrompt: string;
}

// Common validation for controller execute functions
export function validateControllerParams(params: ControllerParams): ValidationResult {
  const trimmedPrompt = params.prompt.trim();
  const isValid = !!(trimmedPrompt && params.provider && params.model);

  return {
    isValid,
    trimmedPrompt,
  };
}

// Extended validation for image edit controllers
export function validateImageEditParams(
  params: ControllerParams & { imageDataUrl: string },
): ValidationResult {
  const baseResult = validateControllerParams(params);

  return {
    ...baseResult,
    isValid: baseResult.isValid && !!params.imageDataUrl,
  };
}
