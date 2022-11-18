import { useRef } from 'react';
import icon_check from "../../assets/images/check.svg";
import icon_info from "../../assets/images/info.svg";
import icon_warning from "../../assets/images/warning.svg";

function useAlert(initial) {
    const toastManagerRef = useRef(initial);

    const setToastInfo = (message, title = "Mensaje") =>
        setConfigToast(true, icon_info, "color-info", message, title)
    const setToastSuccess = (message, title = "Éxito") =>
        setConfigToast(true, icon_check, "color-check", message, title)
    const setToastWarning = (message, title = "Alerta") =>
        setConfigToast(true, icon_warning, "color-warning", message, title)

    const setConfigToast = (show, srcImg, backColor, text, title) => {
        if (!!toastManagerRef) {
            toastManagerRef.current && toastManagerRef.current.changeToast({
                show, srcImg, backColor, text, title
            });
        }
    };

    return {
        toastManagerRef,
        setToastInfo,
        setToastWarning,
        setToastSuccess
    };
};

export { useAlert }