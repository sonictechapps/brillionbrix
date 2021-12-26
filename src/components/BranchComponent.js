import React, { useState } from 'react'
import Card from '../atomiccomponent/Card'
import Dropdown from '../atomiccomponent/Dropdown'
import { constantValues } from '../utils/constants'
import CollapseDetails from './CollpaseDetails'

const BranchComponent = ({ instruction, dropDownBranchOptions, companyName, onBranchChange, onCollapseClick }) => {
    const [isExpand, setExpand] = useState(true)
    const [branch, setBranch] = useState()
    const [branchInstruction, setBranchInstruction] = useState(instruction)
    const onBranchDropDownChange = (index) => {
        setExpand(false)
        setBranch({
            ...dropDownBranchOptions[index],
            index: index
        })
        setBranchInstruction()
        onBranchChange(index)
    }

    const onCollpase = () => {
        onCollapseClick((value, ins) => {
            setExpand(value)
            setBranch()
            setBranchInstruction(ins)
        }, 'Branch-DropDown')
        
    }
    return (
        <Card instruction={branchInstruction}>
            {
                (isExpand) && (

                    <div className="row">
                        <div className="col-12" className='dropDownExpand-active'>
                            <Dropdown options={dropDownBranchOptions} onItemSelectedCallback={onBranchDropDownChange} id='branch-dropdown' selectedIndex={branch?.index}
                                labelTitle={`${constantValues.BRANCH_DROPDOWN_LABEL1}${companyName}${constantValues.BRANCH_DROPDOWN_LABEL2}`} />
                        </div>
                    </div>
                )
            }
            {
                !isExpand && (
                    <div className="row">
                        <div className="col-12" className='dropDownCollapse-active'>
                            <CollapseDetails htmlContent = {<span>{`Branch: ${branch?.name}`}</span>} onEditClick={onCollpase} />
                        </div>
                    </div>

                )
            }
        </Card>
    )

}

export default BranchComponent