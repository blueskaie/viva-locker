import React from "react";
import { Box, TextField } from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

interface TextInputProps {
  value?: any;
  setValue?: any;
  title?: any;
  placeholder?: any;
  type?: any;
  checkflag?: any;
  validationString?: any;
  require?: any;
}
const TextInput: React.FC<TextInputProps> = ({
  value,
  setValue,
  title,
  placeholder,
  type,
  checkflag,
  validationString,
  require,
}) => { 

    console.log(value);
  return (
    <>
      {title ? (
        <Box className="mt-4 font-bold mb-2">
          {title}
          {require ? <span style={{ color: "#c494ff" }}>*</span> : ""}
        </Box>
      ) : (
        ""
      )}
      {type !== "datetime" ? (
        <TextField
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          InputProps={{ style: { color: "#c494ff" } }}
          variant="outlined"
          type={type}
          className="w-100"
        />
      ) : (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDateTimePicker
            id="time-picker"
            value={value}
            onChange={(e) => {
              setValue(e);
            }}
            className="w-100"
            inputVariant="outlined"
            InputProps={{ style: { color: "#c494ff" } }}
          />
        </MuiPickersUtilsProvider>
      )}
      {!checkflag ? (
        <Box className="mt-2" fontSize={12} fontWeight={200} color={"#f14668"}>
          {validationString}
        </Box>
      ) : (
        ""
      )}
    </>
  );
};
export default TextInput;
