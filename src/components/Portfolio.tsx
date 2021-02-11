import {
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonButtons
} from '@ionic/react';
import { settingsOutline } from 'ionicons/icons';
import React from 'react';

const Portfolio = (props:any) => {

    const portfolioHandler = () => {
        props.portfolio(props.name);
    }

    const settingHandler = () => {
        props.setting(props.name);
    }

    return (
        <IonItem style={{marginRight: '16px'}}>
            <IonLabel onClick={portfolioHandler}>{props.name}</IonLabel>
            <IonButtons>
                <IonButton onClick={settingHandler}>
                    <IonIcon slot='icon-only' icon={settingsOutline}/>
                </IonButton>
            </IonButtons>
        </IonItem>
    );
};

export default Portfolio;
