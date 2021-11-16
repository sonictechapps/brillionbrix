import React from 'react'
import AutoCompleteTextView from '../atomiccomponent/AutoCompleteTextView'
import Dropdown from '../atomiccomponent/Dropdown'
import EditText from '../atomiccomponent/CurrencyEditText'
import RadioButton from '../atomiccomponent/RadioButton'
import TabElement from '../atomiccomponent/Tabs'
import Tab from '../atomiccomponent/Tab'
import Tabs from '../atomiccomponent/Tabs'
import TabContent from '../atomiccomponent/TabContent'
import DummyTabContainer from './DummyTabContainer'
import '../sass/titlequoteform.scss'
import InputScreen from './InputScreen'
const TitleQuoteForm = () => {
    const options = [
        {
            value: 'volvo',
            name: 'Volvo',
            checked: true
        },
        {
            value: 'saab',
            name: 'Saab',
            checked: false
        }
    ]

    const tabOptions = [
        {
            value: 'new',
            name: 'New',
            isActive: true,
            isPopOver: false
        },
        {
            value: 'saved',
            name: 'Saved',
            isActive: false,
            isPopOver: true
        }
    ]

    const onItemSelectedCallback = (index) => {
        console.log('index', index)
    }
    return (
        <section className="title_quote_input">
            <div className="container">
                <p className="heading-title">Title Quote</p>
                <Tabs>
                    {
                        tabOptions.map(tab => (
                            <Tab name={tab.name} value={tab.value} isActive={tab.isActive} isPopOver={tab.isPopOver} />
                        ))
                    }
                </Tabs>
                <InputScreen />
                {/* <form autocomplete="off" action="#">
                    <EditText type='text' placeholder='Enter location' />
                    <br />
                    <RadioButton name="radio-button" options={options} dafaultValue={'saab'} />
                    <AutoCompleteTextView listItems={['aa', 'abb']} style={{ width: '300px' }} placeHolder="abc" name="abc" />
                    <Tabs>
                        {
                            tabOptions.map(tab => (
                                <Tab name={tab.name} value={tab.value} isActive={tab.isActive} />
                            ))
                        }
                    </Tabs> */}
                    {/* <TabContent>
                        <DummyTabContainer />
                    </TabContent>
                <Dropdown options={options} onItemSelectedCallback={onItemSelectedCallback} selectedIndex={0} />
            </form> */}
        </div>
        </section >
    )
}

export default TitleQuoteForm