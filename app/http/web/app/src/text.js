import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { refType } from '@material-ui/utils';
import Input from '@material-ui/core/Input';
import FilledInput from '@material-ui/core/FilledInput';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import withStyles from '@material-ui/core/styles/withStyles';

const variantComponent = {
  standard: Input,
  filled: FilledInput,
  outlined: OutlinedInput,
};

export const styles = {
  /* Styles applied to the root element. */
  root: {},
};

/**
 * The `TextField` is a convenience wrapper for the most common cases (80%).
 * It cannot be all things to all people, otherwise the API would grow out of control.
 *
 * ## Advanced Configuration
 *
 * It's important to understand that the text field is a simple abstraction
 * on top of the following components:
 *
 * - [FormControl](/api/form-control/)
 * - [InputLabel](/api/input-label/)
 * - [FilledInput](/api/filled-input/)
 * - [OutlinedInput](/api/outlined-input/)
 * - [Input](/api/input/)
 * - [FormHelperText](/api/form-helper-text/)
 *
 * If you wish to alter the props applied to the `input` element, you can do so as follows:
 *
 * ```jsx
 * const inputProps = {
 *   step: 300,
 * };
 *
 * return <TextField id="time" type="time" inputProps={inputProps} />;
 * ```
 *
 * For advanced cases, please look at the source of TextField by clicking on the
 * "Edit this page" button above. Consider either:
 *
 * - using the upper case props for passing values directly to the components
 * - using the underlying components directly as shown in the demos
 */
const TextField = React.forwardRef(function TextField(props, ref) {
  const {
    autoComplete,
    autoFocus = false,
    children,
    classes,
    className,
    color = 'primary',
    defaultValue,
    disabled = false,
    error = false,
    FormHelperTextProps,
    fullWidth = false,
    helperText,
    hiddenLabel,
    id,
    InputLabelProps,
    inputProps,
    InputProps,
    inputRef,
    label,
    multiline = false,
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    required = false,
    rows,
    rowsMax,
    select = false,
    SelectProps,
    type,
    value,
    variant = 'standard',
    ...other
  } = props;

  const [labelWidth, setLabelWidth] = React.useState(0);
  const labelRef = React.useRef(null);
  React.useEffect(() => {
    if (variant === 'outlined') {
      // #StrictMode ready
      const labelNode = ReactDOM.findDOMNode(labelRef.current);
      setLabelWidth(labelNode != null ? labelNode.offsetWidth : 0);
    }
  }, [variant, required, label]);

  if (process.env.NODE_ENV !== 'production') {
    if (select && !children) {
      console.error(
        'Material-UI: `children` must be passed when using the `TextField` component with `select`.',
      );
    }
  }

  const InputMore = {};

  if (variant === 'outlined') {
    if (InputLabelProps && typeof InputLabelProps.shrink !== 'undefined') {
      InputMore.notched = InputLabelProps.shrink;
    }

    InputMore.labelWidth = labelWidth;
  }
  if (select) {
    // unset defaults from textbox inputs
    if (!SelectProps || !SelectProps.native) {
      InputMore.id = undefined;
    }
    InputMore['aria-describedby'] = undefined;
  }

  const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
  const inputLabelId = label && id ? `${id}-label` : undefined;
  const InputComponent = variantComponent[variant];
  const InputElement = (
    <InputComponent
      aria-describedby={helperTextId}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      defaultValue={defaultValue}
      fullWidth={fullWidth}
      multiline={multiline}
      name={name}
      rows={rows}
      rowsMax={rowsMax}
      type={type}
      value={value}
      id={id}
      inputRef={inputRef}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
      placeholder={placeholder}
      inputProps={inputProps}
      {...InputMore}
      {...InputProps}
    />
  );

  return (
    <FormControl
      className={clsx(classes.root, className)}
      disabled={disabled}
      error={error}
      fullWidth={fullWidth}
      hiddenLabel={hiddenLabel}
      ref={ref}
      required={required}
      color={color}
      variant={variant}
      {...other}
    >
      {label && (
        <InputLabel htmlFor={id} ref={labelRef} id={inputLabelId} {...InputLabelProps}>
          {label}
        </InputLabel>
      )}
      {select ? (
        <Select
          aria-describedby={helperTextId}
          id={id}
          labelId={inputLabelId}
          value={value}
          input={InputElement}
          {...SelectProps}
        >
          {children}
        </Select>
      ) : (
        InputElement
      )}
      {helperText && (
        <FormHelperText id={helperTextId} {...FormHelperTextProps}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
});

TextField.propTypes = {
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary']),
  defaultValue: PropTypes.any,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  FormHelperTextProps: PropTypes.object,
  fullWidth: PropTypes.bool,
  helperText: PropTypes.node,
  hiddenLabel: PropTypes.bool,
  id: PropTypes.string,
  InputLabelProps: PropTypes.object,
  InputProps: PropTypes.object,
  inputProps: PropTypes.object,
  inputRef: refType,
  label: PropTypes.node,
  margin: PropTypes.oneOf(['none', 'dense', 'normal']),
  multiline: PropTypes.bool,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowsMax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  select: PropTypes.bool,
  SelectProps: PropTypes.object,
  type: PropTypes.string,
  value: PropTypes.any,
  variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
};

export { TextField }
