import { useState } from 'react';
import { env } from '../config/env';

/** Shape of an empty contact form. */
const EMPTY_FORM_VALUES = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const CONTACT_ENDPOINT = `${env.apiBaseUrl}/contact`;

/**
 * Validates a single contact form field.
 * @param {keyof typeof EMPTY_FORM_VALUES} name
 * @param {typeof EMPTY_FORM_VALUES} values
 * @returns {string | undefined} error message, if any
 */
function validateField(name, values) {
  switch (name) {
    case 'name':
      return values.name.trim() ? undefined : 'Please enter your name.';

    case 'email': {
      const email = values.email.trim();
      if (!email) return 'Please enter your email address.';
      if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address.';
      return undefined;
    }

    case 'message': {
      const message = values.message.trim();
      if (!message) return 'Please enter a message.';
      if (message.length < 10) return 'Your message should be at least 10 characters.';
      return undefined;
    }

    default:
      return undefined;
  }
}

/**
 * Validates contact form values.
 * @param {typeof EMPTY_FORM_VALUES} values
 * @returns {Record<string, string>} map of field name to error message
 */
function validateContactForm(values) {
  const errors = {};

  for (const name of ['name', 'email', 'message']) {
    const error = validateField(name, values);
    if (error) errors[name] = error;
  }

  return errors;
}

/**
 * Encapsulates all state and behavior for the Contact section's form:
 * field values, validation errors, and submission status.
 *
 * @returns {{
 *   values: typeof EMPTY_FORM_VALUES,
 *   errors: Record<string, string>,
 *   submissionStatus: 'idle' | 'submitting' | 'success' | 'error',
 *   submitError: string,
 *   handleFieldChange: (event: React.ChangeEvent) => void,
 *   handleFieldBlur: (event: React.FocusEvent) => void,
 *   handleSubmit: (event: React.FormEvent) => void,
 * }}
 */
export function useContactForm() {
  const [values, setValues] = useState(EMPTY_FORM_VALUES);
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setValues((previousValues) => ({ ...previousValues, [name]: value }));
  };

  /** Validates a field as soon as the user leaves it, for immediate feedback. */
  const handleFieldBlur = (event) => {
    const { name } = event.target;
    const error = validateField(name, values);

    setErrors((previousErrors) => {
      if (!error) {
        const { [name]: _removed, ...rest } = previousErrors;
        return rest;
      }
      return { ...previousErrors, [name]: error };
    });
  };

  const submitContactForm = async (formValues) => {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.success) {
      throw new Error(result?.message || 'Failed to send your message. Please try again later.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmissionStatus('submitting');
    setSubmitError('');

    submitContactForm(values)
      .then(() => {
        setSubmissionStatus('success');
        setValues(EMPTY_FORM_VALUES);
      })
      .catch((error) => {
        setSubmissionStatus('error');
        setSubmitError(error.message || 'Something went wrong. Please try again later.');
      });
  };

  return {
    values,
    errors,
    submissionStatus,
    submitError,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
  };
}
