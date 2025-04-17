export function validateInputFields(ctx, fields) {
    let valid = true;
  
    fields.forEach(({ model, errorKey, message }) => {
      ctx[errorKey] = ''; // Reset
  
      if (!ctx[model] || String(ctx[model]).trim() === '') {
        ctx[errorKey] = message;
        valid = false;
      }
    });
  
    return valid;
  }
  