import { apiLoginUser, apiLoginWMS, apiSaveCredentialsWMS } from "../../services/http/authentication.service";
import { readAuthCookie, setAuthCookie } from "../../toolbox/helpers/cookie.helper";
import { readAuthLocalStorage, setAuthLocalStorage } from "../../toolbox/helpers/local-storage.helper";
import { AESDecode } from "../../toolbox/helpers/token.helper";
import { isEmpty } from "../../toolbox/helpers/validator.helper";
/**
 * loginSaga
 * @param {object} data
 * @param {function} setLoadData
 * @param {function} setToastWarning
 * @param {function} ActionStoreUser
 * @author Pedro Mendoza Ardiles
 * 
 */
export async function loginSaga (
  data,
  setLoadData,
  setToastWarning,
  ActionStoreUser
) {
  setLoadData({ show: true });
  try {
      const rpta = await apiLoginUser({
          user: data.username,
          password: data.password
      });
      if (rpta.status) {

          const doLogin = () => {
              ActionStoreUser(rpta || {});
              setAuthCookie(rpta.token);
              setAuthLocalStorage(rpta);
              window.location.href = '/';
          };
          if (isEmpty(rpta.userData.userId)) {
              setLoadData({ show: true, text: 'Obteniendo credenciales WMS...' });
              const wms = getAccessWMSSaga(rpta.userAuthorizes);
              if (wms === null) {
                return setToastWarning('Ocurrió un problema al iniciar sesión');
              }
              const rpta_wms = await apiLoginWMS(wms, data.username);
              apiSaveCredentialsWMS(rpta_wms, data.username);
              rpta.userAuthorizes.wms = wms;
              doLogin();
          } else {
              doLogin();
          }

      } else {
          setToastWarning(rpta.message);
      }
      setLoadData({ show: false });
  } catch (error) {
      if (error?.response?.data?.code === 'NOT_FOUND') {
        setToastWarning('Consulte con su proveedor','No posee credenciales WMS');
      } else {
        setToastWarning('Ocurrió un problema al iniciar sesión');
      }
      setLoadData({ show: false });
  }
}

/**
 * verifyCookieSaga
 * @param {function} setLoadView
 * 
 */
export function verifyCookieSaga (setLoadView) {
    const token = readAuthCookie();
    const dataStorage = readAuthLocalStorage();
    if (token != null && dataStorage != null) {
        window.location.href = '/';
    } else {
        setLoadView && setLoadView(true);
    }
}

/**
 * getAccessWmsSaga
 * @param {function} setLoadView
 * 
 */
export function getAccessWMSSaga (userAuthorizes) {
  const wms = {};
  if (!userAuthorizes?.wms) {
    return null
  }
  wms.apis = AESDecode(userAuthorizes.wms.apis, userAuthorizes.wms.key||'');
  wms.user = AESDecode(userAuthorizes.wms.user, userAuthorizes.wms.key||'');
  wms.pass = AESDecode(userAuthorizes.wms.pass, userAuthorizes.wms.key||'');

  return wms;
}
