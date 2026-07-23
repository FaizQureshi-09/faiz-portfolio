/**
 * Labeled form field (input or textarea) with inline validation error
 * display. Shared by every field in the contact form to keep markup
 * and accessibility attributes consistent.
 *
 * @param {object} props
 * @param {string} props.id - field id, also used to build the label's `for`
 * @param {string} props.name - form field name
 * @param {string} props.label - visible label text
 * @param {string} [props.type='text'] - input type; ignored when `as="textarea"`
 * @param {'input'|'textarea'} [props.as='input'] - element to render
 * @param {string} props.value - controlled field value
 * @param {(event: React.ChangeEvent) => void} props.onChange - change handler
 * @param {(event: React.FocusEvent) => void} [props.onBlur] - blur handler, used for inline validation
 * @param {string} [props.error] - validation error message, if any
 * @param {boolean} [props.required] - whether the field is required
 * @param {number} [props.maxLength] - max character count; also renders a live "used/limit" counter
 */
export function ContactFormField({
  id,
  name,
  label,
  type = 'text',
  as = 'input',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  maxLength,
}) {
  const Field = as;

  return (
    <div className="contact-form-field">
      <div className="contact-form-field__label-row">
        <label htmlFor={id} className="contact-form-field__label">
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
        {maxLength ? (
          <span className="contact-form-field__counter">
            {value.length}/{maxLength}
          </span>
        ) : null}
      </div>
      <Field
        id={id}
        name={name}
        type={as === 'input' ? type : undefined}
        rows={as === 'textarea' ? 5 : undefined}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`contact-form-field__control ${error ? 'contact-form-field__control--error' : ''}`}
      />
      {error ? (
        <p id={`${id}-error`} className="contact-form-field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
