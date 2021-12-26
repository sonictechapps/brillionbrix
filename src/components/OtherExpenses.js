import React, { useEffect, useState } from 'react'
import Card from '../atomiccomponent/Card'
import ToggleButton from '../atomiccomponent/ToggleButton'

const OtherExpenses = ({ otherExpenses, instruction }) => {
    const [listOtherExpense, setListOtherExpense] = useState([])
    useEffect(() => {
        const list = []
        otherExpenses?.otherExpensesOptionsList?.map(otherExpense => {

            list.push({
                ...otherExpense,
                desc: otherExpense.otherExpensesOptionLabel,
                defaultValue: otherExpense.otherExpensesOptionDefaultValue,
                currencyPlaceHolder: otherExpense.otherExpensesOptionDescription,
                id: otherExpense.otherExpensesOptionID
            })
        })
        setListOtherExpense(list)
    }, [otherExpenses])

    const setOtherExpense = (value, id) => {
       
    }
    return (
        <Card instruction={instruction}>
            <div style={{ marginTop: '40px' }}>
                {
                    listOtherExpense.length > 0 && listOtherExpense.map(expense => (
                        <ToggleButton isDescEdit={expense.otherExpensesOptionDescription === ''} description={expense.desc}
                            currencyDefaultValue={expense.defaultValue} id={expense.id} isChecked={expense.selected === 'true'} setOtherExpenses={setOtherExpense} />
                    ))
                }
            </div>
        </Card>
    )
}

export default OtherExpenses