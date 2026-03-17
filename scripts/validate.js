function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validateRequired(value) {
  return value.trim().length > 0;
}

function sanitizeName(value) {
  return value
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '');
}

function validateMessageLength(value) {
  return value.trim().length >= 10;
}

function getErrorMessage(field) {
  const messages = {
    email:     'Please enter a valid email address.',
    name:      'Please enter your name (at least 2 characters).',
    eventType: 'Please select an event type.',
    message:   'Please tell us a bit more (at least 10 characters).',
  };
  return messages[field] || '';
}
