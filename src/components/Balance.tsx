import {
    IonProgressBar,
    IonBadge,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonCol,
    IonRow,
    IonGrid,
    IonItem,
    IonList,
    IonCard,
    IonAlert,
    IonContent
} from '@ionic/react';
import { createOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import BalanceDTO from '../dto/BalanceDTO';

const Balance = (props:any) => {
    const [alertCash, setAlertCash] = useState<boolean>(false);

    const editCashBalance = (data:any) => {
        if(data['cash'] >= 0 && data['currency'].replace(/\s/g, '') !== '') {
            props.data['cash'] = data['cash'];
            props.data['currency'] = data['currency'];
        }
    }

    return (
        <IonContent class='ion-padding'>
            <IonCard>
                <IonItem style={{marginRight: '16px'}}>
                    <IonLabel>Cash: {props.data['cash']} {props.data['currency']}</IonLabel>
                    <IonButtons>
                        <IonButton onClick={() => setAlertCash(true)}>
                            <IonIcon slot='icon-only' icon={createOutline}/>
                        </IonButton>
                    </IonButtons>
                </IonItem>
                <IonItem lines='none' style={{marginRight: '16px'}}>
                    <IonProgressBar value={0.5}/>
                    <IonBadge slot='end'>100%</IonBadge>
                </IonItem>
            </IonCard>
            <IonList>
                {props.data['balance'] && props.data['balance'].map((value:BalanceDTO, index:number) =>
                    <IonItem key={index} style={{marginRight: '16px'}}>
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>{value['asset']}</IonLabel>
                                </IonCol>
                                <IonCol>
                                    <IonLabel class='ion-text-center' style={{fontSize: '0.8em', marginTop: '4px'}}>
                                        {value['amount']} @ {value['price']} {props.data['currency']}
                                    </IonLabel>
                                </IonCol>
                                <IonCol>
                                    <IonLabel class='ion-text-right'>
                                        {value['amount'] * value['price']} {props.data['currency']}
                                    </IonLabel>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonProgressBar value={0.5} style={{marginTop: '8px'}}/>
                                </IonCol>
                                <IonCol size='auto'>
                                    <IonBadge style={{marginLeft: '20px'}}>100%</IonBadge>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItem>
                )}
            </IonList>
            <IonAlert
                isOpen={alertCash}
                onDidDismiss={() => setAlertCash(false)}
                header={'Edit Cash Balance'}
                inputs={[
                    {
                        name: 'cash',
                        type: 'number',
                        value: props.data['cash'],
                        placeholder: 'Enter your amount of cash...'
                    }, {
                        name: 'currency',
                        type: 'text',
                        value: props.data['currency'],
                        placeholder: 'Enter your desired currency...'
                    }
                ]}
                buttons={[
                    {
                        text: 'Confirm',
                        handler: (data) => {editCashBalance(data)}
                    }, 'Cancel'
                ]}
            />
        </IonContent>
    );
};

export default Balance;
