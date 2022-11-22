import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const _SnackBar_ = ({open, onClose, severity, message}) => {
    return <Snackbar open={open} onClose={onClose} autoHideDuration={4000} anchorOrigin={{ vertical: "top", horizontal: "left" }} >
          <MuiAlert severity={severity} variant="filled">{message}</MuiAlert>
      </Snackbar>
}

export default _SnackBar_;
