import React from 'react'

const MyList = ({ header, items }) => {
    return (
        <div>
            <h1>{header}</h1>
            <ol>
                {/* Looping through the items list with the map() function */}
                {items.map(item => (
                    <li key={item.id}>
                        {item.text}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default MyList