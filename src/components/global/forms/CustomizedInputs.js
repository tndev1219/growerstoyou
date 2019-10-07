import React from "react";
import PropTypes from "prop-types";
import {
  withStyles,
} from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import purple from "@material-ui/core/colors/purple";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    width: "100%"
  },
  cssLabel: {
    "&$cssFocused": {
      color: purple[500]
    }
  },
  cssFocused: {},
  cssUnderline: {
    "&:after": {
      borderBottomColor: purple[500]
    }
  },
  bootstrapRoot: {
    "label + &": {
      marginTop: theme.spacing(3)
    }
  },
  bootstrapInput: {
    borderRadius: 5,
    position: "relative",
    backgroundColor: theme.palette.common.white,
    border: "1px solid #ced4da",
    fontSize: 16,
    // width: "auto",
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#08af19",
      boxShadow: "0 0 0 0.2rem rgba(0,123,0,.25)"
    }
  },
  bootstrapFormLabel: {
    fontSize: 20,
    marginLeft: "10px"
  }
});

function CustomizedInputs(props) {
  const { classes, label, isRequire, isMultiline, rowsNumber, placeholder, isTextAlignCenter, inputType, handleChange, name, error, value } = props;

  return (
      <FormControl 
        className={classes.margin} 
        required={isRequire}
        error={error}
      >
        <InputLabel
          shrink
          htmlFor="bootstrap-input"
          className={classes.bootstrapFormLabel}
        >
          {label}
        </InputLabel>
        {isMultiline ? 
          <InputBase
            classes={{
              root: classes.bootstrapRoot,
              input: classes.bootstrapInput
            }}
            type={inputType}
            name={name}
            multiline={isMultiline}
            rows={rowsNumber}
            onChange={(e) => handleChange(e)}
            value={value}
          /> :
          <InputBase
            classes={{
              root: classes.bootstrapRoot,
              input: classes.bootstrapInput
            }}
            className={isTextAlignCenter? "custom-input" : ""}
            type={inputType}
            name={name}
            placeholder={placeholder}
            onChange={(e) => handleChange(e)}
            value={value}
          />
        }
      </FormControl>
  );
}

CustomizedInputs.propTypes = {
  classes: PropTypes.object,
  label: PropTypes.string,
  isRequire: PropTypes.bool,
  isMultiline: PropTypes.bool,
  rowsNumber: PropTypes.string,
  placeholder: PropTypes.string,
  isTextAlignCenter: PropTypes.bool,
  inputType: PropTypes.string,
  handleChange: PropTypes.func,
  name: PropTypes.string,
  error: PropTypes.bool,
  value: PropTypes.string
};

export default withStyles(styles)(CustomizedInputs);