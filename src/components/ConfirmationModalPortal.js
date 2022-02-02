import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from 'react-dom';
import '../sass/custommodalportal.scss'
import { constantValues } from '../utils/constants';
import { getColor, getStingOnLanguage } from '../utils/utility';

const ConfirmationModalPortal = ({ modalTitle, modalContent, modalSubcontent, yesMessage, noMessage, onYesCallback, onNoCallback, modalshow }) => {
    const custommodal = React.createRef()

    const onModalClose = () => {
        custommodal.current.style.display = 'none'
        onNoCallback()
    }



    return ReactDOM.createPortal(
        <div ref={custommodal} className={`modal ${modalshow && 'show-modal'}`}>
            <div className="modal-content">
                <div className="modal-body">
                    <p className="modal-desc">{modalContent}</p>
                    {modalSubcontent && <p className="modal-subdesc">{modalSubcontent}</p>}                 
                </div>
                <div className="modal-footer">
                    <button style={{backgroundColor: getColor(), color: 'black', fontWeight: 'bold'}} onClick={onYesCallback}>{yesMessage || getStingOnLanguage('YES')}</button>
                    <button style={{backgroundColor: getColor(), color: 'black', fontWeight: 'bold'}} onClick={onModalClose}>{noMessage || getStingOnLanguage('NO')}</button>

                </div>
            </div>
        </div>, document.getElementById('confirmation-modal-portal')

    )
}

export default ConfirmationModalPortal