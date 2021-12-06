import React from 'react'
import '../sass/titlequoteform.scss'
import InputScreen from './InputScreen'
const TitleQuoteForm = () => {
    return (
        <section className="title_quote_input">
            <div className="container">
                {/* <Tabs>
                    {
                        tabOptions.map(tab => (
                            <Tab name={tab.name} value={tab.value} isActive={tab.isActive} isPopOver={tab.isPopOver} />
                        ))
                    }
                </Tabs> */}
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