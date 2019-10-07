import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import PropTypes from "prop-types";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { InputLabel, FormControl, withStyles } from "@material-ui/core";
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
  bootstrapFormLabel: {
    fontSize: 20,
    marginLeft: "10px"
  }
});

function MaterialUIPickers(props) {

  const { classes, label, isRequire, error, name, setDate } = props;

  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(
    new Date()
  );

  function handleDateChange(date, e) {
    setSelectedDate(date);
    setDate(e, name);
  }

  return (
    <div className="custom-datepicker">
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
        <MuiPickersUtilsProvider 
          utils={DateFnsUtils}
        >        
          <KeyboardDatePicker
            classes={{
              root: classes.bootstrapRoot
            }}
            autoOk
            variant="inline"
            inputVariant="outlined"
            format="yyyy-MM-dd"
            value={selectedDate}
            InputAdornmentProps={{ position: "start" }}
            onChange={(date, e) => handleDateChange(date, e)}          
          />
        </MuiPickersUtilsProvider>
      </FormControl>
    </div>
  );
}

MaterialUIPickers.propTypes = {
  classes: PropTypes.object,
  label: PropTypes.string,
  isRequire: PropTypes.bool,
  error: PropTypes.bool,
  name: PropTypes.string,
  setDate: PropTypes.func
};

export default withStyles(styles)(MaterialUIPickers);