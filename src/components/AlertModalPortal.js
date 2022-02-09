import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from 'react-dom';
import '../sass/custommodalportal.scss'
import { constantValues } from '../utils/constants';
import { getColor } from '../utils/utility';

const AlertModalPortal = ({ modalTitle, modalContent, modalSubcontent, okMessage, onOkCallback, modalshow }) => {
    const custommodal = React.createRef()

    const onModalClose = () => {
        custommodal.current.style.display = 'none'
    }

    return ReactDOM.createPortal(
        <div ref={custommodal} className={`modal ${modalshow && 'show-modal'}`}>
            <div className="modal-content">
                <div className="modal-body">
                    <p className="modal-desc">{modalContent}</p>
                    {modalSubcontent && <p className="modal-subdesc">{modalSubcontent}</p>}                 
                </div>
                <div className="modal-footer">
                    <button style={{backgroundColor: getColor(), color: 'black', fontWeight: 'bold'}} onClick={onOkCallback}>{okMessage || 'Ok'}</button>

                </div>
            </div>
        </div>, document.getElementById('alert-modal-portal')

    )
}

export default AlertModalPortal