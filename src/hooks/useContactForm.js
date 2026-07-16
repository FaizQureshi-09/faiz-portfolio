import { useState } from 'react';

/** Shape of an empty contact form. */
const EMPTY_FORM_VALUES = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
 * NOTE: `submitContactForm` is a placeholder — it does not send data
 * anywhere yet. Wire it up to an API/email service (e.g. an AWS API
 * Gateway + Lambda endpoint or a service like EmailJS) when backend
 * functionality is added.
 *
 * @returns {{
 *   values: typeof EMPTY_FORM_VALUES,
 *   errors: Record<string, string>,
 *   submissionStatus: 'idle' | 'submitting' | 'success',
 *   handleFieldChange: (event: React.ChangeEvent) => void,
 *   handleSubmit: (event: React.FormEvent) => void,
 * }}
 */
export function useContactForm() {
  const [values, setValues] = useState(EMPTY_FORM_VALUES);
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState('idle');

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setValues((previousValues) => ({ ...previousValues, [name]: value }));
  };

  /** Placeholder submit handler — replace with a real API call later. */
  const submitContactForm = async (formValues) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    // eslint-disable-next-line no-console
    console.info('Contact form submitted (no backend wired up yet):', formValues);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmissionStatus('submitting');
    submitContactForm(values).then(() => {
      setSubmissionStatus('success');
      setValues(EMPTY_FORM_VALUES);
    });
  };

  return { values, errors, submissionStatus, handleFieldChange, handleSubmit };
}
