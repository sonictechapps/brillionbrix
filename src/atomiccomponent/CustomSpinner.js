import { useEffect } from 'react'
import '../sass/cutomespinner.scss'
import ReactDOM from 'react-dom';

const CustomSpinner = ({ loadingData }) => {

    useEffect(() => {
    }, [loadingData])

    return ReactDOM.createPortal(
        <div className={`spinnercontainer ${!loadingData && 'hide'}`}>
            <div className="loader"></div>
        </div>, document.getElementById('spinner')

    )
}

export default CustomSpinner
