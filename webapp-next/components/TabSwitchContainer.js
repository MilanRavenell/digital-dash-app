import React from 'react';
// import '../styles/TabSwitchContainer.css'

const  TabSwitchContainer = ({ tabList, showSelectAll, currentTabs, onChange, children }) => {
    const [state, setState] = React.useState({
        tabs: tabList,
      });

    const onClick = (value) => {
        onChange(value);
    };

    React.useEffect(() =>{
        if (showSelectAll && !state.tabs.includes('select all')) {
            const tabs = state.tabs;
            tabs.unshift('select all');
            setState((prevState) => ({
                ...prevState,
                tabs,
            }));
        }
    });

    const style = (value) => {
        const activeStyles = (currentTabs.includes(value))
            ? {
                color: 'red',
            } : {
                color: 'black',
            };

        return {
            flex: 1,
            ...activeStyles,
        };
    };

    return (
        <div className="TabSwitchContainer">
            <div style={{border:"1px solid black", borderRadius: '5px', margin: '10px', display: 'flex'}}>

                { state.tabs.map((tab) => (
                    <div key={tab} onClick={() => onClick(tab)} style={style(tab)}>{tab[0].toUpperCase() + tab.substring(1)}</div>
                ))}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}

export default TabSwitchContainer;