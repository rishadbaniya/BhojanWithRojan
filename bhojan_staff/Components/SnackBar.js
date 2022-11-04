import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export const _SnackBar_ = ({open, onClose, severity, message}) => {
    console.log(open);
    console.log(message);
    console.log(severity);
      <Snackbar open={open} onClose={onClose} autoHideDuration={4000} anchorOrigin={{ vertical: "top", horizontal: "left" }} >
          <MuiAlert severity={severity} variant="filled"> {message} </MuiAlert>
      </Snackbar>
}
