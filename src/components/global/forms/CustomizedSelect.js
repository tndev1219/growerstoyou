import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
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

function CustomizedSelect(props) {
  const { classes, label, isRequire, handleChange, error, abbreviation2Name, values, name, value } = props;
  const [val, setValues] = React.useState({
    state: value ? value : ""
  });

  function handleChanges(event) {
    setValues(oldValues => ({
      ...oldValues,
      state: event.target.value
    }));
    event.target.value = abbreviation2Name(event.target.value).name;
    handleChange(event);
  }

  return (
    <div className="custom-select">
      <FormControl 
        className={classes.margin} 
        required={isRequire}
        error={error}
      >
        <InputLabel
          shrink
          className={classes.bootstrapFormLabel}
        >
          {label}
        </InputLabel>
        <Select
          value={val.state}
          onChange={handleChanges}
          input={
            <OutlinedInput
              classes={{
                root: classes.bootstrapRoot,
                input: classes.bootstrapInput
              }}
              labelWidth={0}
              name={name}
            />
          }
        >
          {values.map((value, index) => (
            <MenuItem key={index} value={value.abbreviation}>{value.name}</MenuItem>  
          ))}
        </Select>
      </FormControl>      
    </div>
  );
}

CustomizedSelect.propTypes = {
  classes: PropTypes.object,
  label: PropTypes.string,
  isRequire: PropTypes.bool,
  handleChange: PropTypes.func,
  error: PropTypes.bool,
  values: PropTypes.array,
  name: PropTypes.string,
  abbreviation2Name: PropTypes.func,
  value: PropTypes.string
};

export default withStyles(styles)(CustomizedSelect);