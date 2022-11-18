import React, { useRef, useState } from "react";
import { Helmet } from 'react-helmet';
import { connect } from "react-redux";
import Protected from '../../components/layout/Protected';
import { ToastNew } from "../../components/common/Toast/ToastNew";
import icon_check from "../../assets/images/check.svg";
import icon_info from "../../assets/images/info.svg";
import icon_warning from "../../assets/images/warning.svg";
import Loading from "../../components/common/Loading/Loading";
import { Tab,Tabs,TabPanel } from '../../components/common/TabPanel/TabPanel.component';
import RegisterProfile from './components/RegisterProfile.component';
import ProfileView from './components/ProfileManager.component';

const ProfileManager = (props) => {

    const [value, setValue] = useState(0);
    const [loadData, setLoadData] = useState(false);
    const toastManagerRef = useRef(null);
    const nameView = useRef('Administrador de Perfiles');

    const setToastInfo = (message) =>
        setConfigToast(true, icon_info, "color-info", message, "Mensaje")
    const setToastSuccess = (message) =>
        setConfigToast(true, icon_check, "color-check", message, "Éxito")
    const setToastWarning = (message) =>
        setConfigToast(true, icon_warning, "color-warning", message, "Alerta")

    const setConfigToast = (show, srcImg, backColor, text, title) => {
        if (!!toastManagerRef) {
            toastManagerRef.current && toastManagerRef.current.changeToast({
                show, srcImg, backColor, text, title
            });
        }
    };

    const panelViewProps = {
        setToastInfo,
        setToastSuccess,
        setToastWarning,
        setLoadData
    }

    return (
        <Protected nav={true} navTo={'/'}>
            <Helmet>
                <title>{`${props.$store.application.name} - ${nameView.current}`}</title>
            </Helmet>
            <ToastNew ref={toastManagerRef} />
            <div className="jumbotron text-center p-3 mb-0">
                <h1>{nameView.current}</h1>
            </div>
            <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                <Tabs
                    value      = {value}
                    onChange   = {setValue}
                    styleProps = {{ boxShadow: 'none', borderWidth: 2 }}
                >
                    <Tab label="Registro de Perfil"/>
                    <Tab label="Gestión de Pantallas"/>
                </Tabs>
            </div>
            <TabPanel value={value} index={0}> <RegisterProfile {...panelViewProps}/> </TabPanel>
            <TabPanel value={value} index={1}> <ProfileView {...panelViewProps}/> </TabPanel>
            {loadData && <Loading />}
        </Protected>
    )
}


const mapStateToProps = (state) => ({
    $store: {
        application: state.application
    }
})
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileManager);