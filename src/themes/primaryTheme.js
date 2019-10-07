/**
 * App Light Theme
 */
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
   palette: {
      primary: {
         main: '#08AF19'
      },
      secondary: {
         main: '#FFFFFF'
      }
   },
   typography: {
      useNextVariants: true
   }
});

export default theme;