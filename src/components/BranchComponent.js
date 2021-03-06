import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import Dropdown from '../atomiccomponent/Dropdown'
import { constantValues } from '../utils/constants'
import { getStingOnLanguage } from '../utils/utility'
import CollapseDetails from './CollpaseDetails'

const BranchComponent = ({ instruction, dropDownBranchOptions, companyName, onBranchChange, onCollapseClick, isBranchExpand }) => {
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
    useEffect(() => {
        isBranchExpand && setExpand(isBranchExpand)
        isBranchExpand && setBranch()
        isBranchExpand && setBranchInstruction(instruction)
    }, [isBranchExpand])

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
                        <div className="col-12 dropDownExpand-active">
                            <Dropdown options={dropDownBranchOptions} onItemSelectedCallback={onBranchDropDownChange} id='branch-dropdown' selectedIndex={branch?.index}
                                labelTitle={`${getStingOnLanguage('BRANCH_DROPDOWN_LABEL1')}${companyName}${getStingOnLanguage('BRANCH_DROPDOWN_LABEL2')}`} />
                        </div>
                    </div>
                )
            }
            {
                !isExpand && (
                    <div className="row">
                        <div className="col-12 dropDownCollapse-active">
                            <CollapseDetails htmlContent={<span>{`${getStingOnLanguage('BRANCH_SPAN')} ${branch?.name}`}</span>} onEditClick={onCollpase} showEdit={true} />
                        </div>
                    </div>

                )
            }
        </Card>
    )

}

export default BranchComponent