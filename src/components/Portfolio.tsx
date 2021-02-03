import {
    IonButtons,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel
} from '@ionic/react';
import { settingsOutline } from 'ionicons/icons';
import React from 'react';

const Portfolio = (props:any) => {

    const portfolioHandler = () => {
        props.handler(props.value);
    }

    return (
        <IonItem style={{marginRight: '16px'}}>
            <IonLabel onClick={portfolioHandler}>{props.value}</IonLabel>
            <IonButtons>
                <IonButton onClick={() => console.log('wip: Rename and delete function')}>
                    <IonIcon slot='icon-only' icon={settingsOutline}/>
                </IonButton>
            </IonButtons>
        </IonItem>
    );
};

export default Portfolio;
