import { useState } from 'react';
import { env } from '../config/env';

/** Shape of an empty contact form. */
const EMPTY_FORM_VALUES = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_ENDPOINT = `${env.apiBaseUrl}/contact`;

/**
 * Validates contact form values.
 * @param {typeof EMPTY_FORM_VALUES} values
 * @returns {Record<string, string>} map of field name to error message
 */
function validateContactForm(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Please enter your name.';
  }

  if (!values.email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.message.trim()) {
    errors.message = 'Please enter a message.';
  } else if (values.message.trim().length < 10) {
    errors.message = 'Your message should be at least 10 characters.';
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

  return { values, errors, submissionStatus, submitError, handleFieldChange, handleSubmit };
}
