import React from 'react';
import { FormControl, RadioGroup, FormControlLabel, FormLabel, Radio } from '@mui/material';

type RadioGroupCustomizeProps = {
  text: string;
  options: any[];
  value: string;
  field_name: string;
  field_text: string;
  field_value: string;
  handleOnSelect: (value: string, field_name: string) => void;
};

const RadioGroupCustomize: React.FC<RadioGroupCustomizeProps> = (props: RadioGroupCustomizeProps) => {
  const { text, options, value, field_name, field_text, field_value, handleOnSelect } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleOnSelect((event.target as HTMLInputElement).value, field_name);
  };

  return (
    <FormControl sx={{ marginBlock: 2 }}>
      <FormLabel id="radio-buttons-group-label">{text}</FormLabel>
      <RadioGroup
        aria-labelledby="radio-buttons-group-label"
        defaultValue=""
        name="radio-buttons-group"
        value={value}
        sx={{ paddingLeft: 2 }}
        onChange={handleChange}
      >
        {options.map((option: any, index: number) => {
          return (
            <FormControlLabel
              key={`radio_${index}`}
              value={option[field_value]}
              control={<Radio />}
              label={option[field_text]}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioGroupCustomize;
