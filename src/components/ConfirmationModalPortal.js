import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from 'react-dom';
import '../sass/custommodalportal.scss'
import { constantValues } from '../utils/constants';

const ConfirmationModalPortal = ({ modalTitle, modalContent, yesMessage, noMessage, onYesCallback, onNoCallback, modalshow }) => {
    const custommodal = React.createRef()

    const onModalClose = () => {
        custommodal.current.style.display = 'none'
        onNoCallback()
    }



    return ReactDOM.createPortal(
        <div ref={custommodal} className={`modal ${modalshow && 'show-modal'}`}>
            <div className="modal-content">
                <div className="modal-headers">
                    <span className="close" onClick={onModalClose}>&times;</span>
                    <h2>{modalTitle || constantValues.APPLICATION_TITLE}</h2>
                </div>
                <hr />
                <div className="modal-body">
                    <p className="modal-desc">{modalContent}</p>
                </div>
                <div className="modal-footer">
                    <button onClick={onYesCallback}>{yesMessage || 'Yes'}</button>
                    <button onClick={onModalClose}>{noMessage || 'No'}</button>

                </div>
            </div>
        </div>, document.getElementById('confirmation-modal-portal')

    )
}

export default ConfirmationModalPortal