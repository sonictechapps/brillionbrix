import React from "react"
import '../sass/accordion.scss'

const Accordion = ({ header, children }) => {

    const onAccordionClick = (e) => {
        const elem = e.target
        elem.classList.toggle('active-accordion')
        let panel = elem.nextElementSibling
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px"
        }
    }
    return (
        <div className="accordion-holder" id="accordion">
            <button class="accordion" onClick={(e) => onAccordionClick(e)}>{header}</button>
            <div class="panel">
                {children}
            </div>
        </div>
    )
}

export default Accordion