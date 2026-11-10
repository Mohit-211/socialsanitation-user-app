import React from 'react';
import {
  Controller,
  type Control,
  type ControllerProps,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import TextField from './TextField';

type Props<T extends FieldValues, N extends Path<T>> = Omit<
  React.ComponentProps<typeof TextField>,
  'value' | 'onChangeText' | 'onBlur' | 'error' | 'ref'
> & {
  control: Control<T>;
  name: N;
  rules?: ControllerProps<T, N>['rules'];
};

/** A TextField bound to a react-hook-form field, showing that field's error. */
export default function FormTextField<
  T extends FieldValues,
  N extends Path<T>,
>({ control, name, rules, ...field }: Props<T, N>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur, ref },
        fieldState: { error },
      }) => (
        <TextField
          {...field}
          ref={ref}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  );
}
