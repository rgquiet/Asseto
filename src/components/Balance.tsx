import React from 'react';

const Balance = (props:any) => {

    return (
        <div>
            <p>{props.data['cash']}</p>
            {props.data['balance'] && props.data['balance'].map((value:any, index:number) =>
                <p key={index}>{value}</p>
            )}
        </div>
    );
};

export default Balance;
