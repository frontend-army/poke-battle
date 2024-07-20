import { ToastContainer as ToastifyContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastContainer() {
  return <ToastifyContainer position="bottom-center" closeOnClick />;
}
