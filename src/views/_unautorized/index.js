import React from 'react';
import { i_sp_lg } from '../../providers/modules/images';

const styles = {
    logoContainer: {
        height: '80px',
        width: '100%',
        maxWidth: '100%'
    }
}

const Unauthorized = () => {

    return(
        <div style={{position:'fixed',top:0,left:0,width:'100%',height:'100%', backgroundColor: 'black'}}>
            <div className="container bg-light justify-content-center" style={styles.logoContainer}>
                <img src={i_sp_lg.img_qs_logo} width="200" alt="Logo QS" style={{display:'block', margin: 'auto', paddingTop: '24px'}} />
            </div>
            <h1 style={{margin: '0 auto', marginTop: '100px', width: '100%', textAlign: 'center', fontSize: '22px', color: '#fff'}}>Contenido no autorizado</h1>
            <footer className="l-intranet__footer justify-content-center" style={{color: '#868686', padding: '2rem'}}>
              Copyright © {(new Date).getFullYear()} Química Suiza. Todos los derechos reservados.
            </footer>
        </div>
    )
}

export default(Unauthorized);