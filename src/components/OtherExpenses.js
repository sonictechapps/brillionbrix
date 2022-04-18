import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import ToggleButton from '../atomiccomponent/ToggleButton'
import { getLanguage, getStingOnAPILanguage } from '../utils/utility'

const OtherExpenses = ({ otherExpenses, instruction, getOtherExpense }) => {
    const [listOtherExpense, setListOtherExpense] = useState([])
    
    useEffect(() => {
        const list = []
        otherExpenses?.otherExpensesOptionList?.map(otherExpense => {

            list.push({
                ...otherExpense,
                desc: getStingOnAPILanguage(otherExpense, 'otherExpensesOptionLabel'),
                defaultValue: otherExpense.otherExpensesOptionDefaultValue.toString(),
                currencyPlaceHolder: getStingOnAPILanguage(otherExpense, 'otherExpensesOptionDescription'),
                id: otherExpense.otherExpensesOptionId
            })
        })
        setListOtherExpense(list)
    }, [otherExpenses])

    const setOtherExpense = (value, id) => {
        getOtherExpense && getOtherExpense({
            otherExpensesOptionID: id.toString(),
            otherExpensesDescription: value.currencyDesc,
            otherExpensesOptionDefaultValue: value.currencyValue,
            otherExpensesOptionLabel: value.descValue
        }, id)
    }
    return (
        <Card instruction={instruction}>
            <div style={{ marginTop: '40px' }}>
                {
                    listOtherExpense.length > 0 && listOtherExpense.map(expense => (
                        <ToggleButton isDescEdit={expense.otherExpensesOptionDescription === ''} description={expense.desc} descValue={expense.otherExpensesOptionDescription}
                            currencyDefaultValue={expense.defaultValue} id={expense.id} isChecked={expense.selected === 'true'} setExpenses={setOtherExpense} />
                    ))
                }
            </div>
        </Card>
    )
}

export default OtherExpenses