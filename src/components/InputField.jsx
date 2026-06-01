import styles from './InputField.module.css';

export function InputField({
  label,
  error,
  multiline = false,
  className = '',
  ...props
}) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className={`${styles.field} ${className}`}>
      {label ? <label className={styles.label}>{label}</label> : null}
      <Tag
        className={`${styles.input} ${error ? styles.inputError : ''} ${multiline ? styles.textarea : ''}`}
        {...props}
      />
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
