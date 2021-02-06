import {
    IonProgressBar,
    IonRange,
    IonBadge,
    IonLabel,
    IonItem,
    IonIcon,
    IonToggle,
    IonFabButton,
    IonFab,
    IonCol,
    IonRow,
    IonGrid,
    IonList,
    IonCard,
    IonAlert,
    IonContent
} from '@ionic/react';
import { add } from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import AssetDTO from '../dto/AssetDTO';

const Balance = (props:any) => {
    const [toggleMode, setToggleMode] = useState<boolean>(true);
    const [alertCash, setAlertCash] = useState<boolean>(false);
    const [alertEditAsset, setAlertEditAsset] = useState<boolean>(false);
    const [alertAddAsset, setAlertAddAsset] = useState<boolean>(false);
    const [temp, setTemp] = useState<number>(-1);

    useEffect(() => {
        if(temp === -1) {
            setAlertEditAsset(false);
        } else {
            if(toggleMode) {
                setAlertEditAsset(true);
            } else {
                // wip: Only updated when temp changes (add props.data to deps)
                setTemp(-1);
            }
        }
    }, [temp]);

    const editCash = (data:any) => {
        if(data['currency'].replace(/\s/g, '') !== '' && data['cash'] >= 0) {
            props.data['currency'] = data['currency'];
            if(data['cash'] === '') {
                props.data['cash'] = 0;
            } else {
                props.data['cash'] = parseFloat(data['cash']);
            }
        }
    }

    const editAsset = (data:any) => {
        if(data['name'].replace(/\s/g, '') !== '' && data['amount'] > 0 && data['price'] > 0) {
            let array:AssetDTO[] = [...props.data['assets']];
            array[temp] = new AssetDTO(
                data['name'],
                parseFloat(data['amount']),
                parseFloat(data['price']),
                props.data['assets'][temp]['target']
            );
            props.data['assets'] = array;
        }
    }

    const addAsset = (data:any) => {
        if(data['name'].replace(/\s/g, '') !== '' && data['amount'] > 0 && data['price'] > 0) {
            props.data['assets'] = [...props.data['assets'], new AssetDTO(
                data['name'],
                parseFloat(data['amount']),
                parseFloat(data['price']),
                0
            )];
        }
    }

    const setTarget = (target:number, index:number) => {
        props.data['assets'][index]['target'] = target;
        setTemp(index);
    }

    return (
        <IonContent class='ion-padding'>
            <IonCard>
                <IonItem style={{marginRight: '16px'}}>
                    <IonLabel onClick={() => setAlertCash(toggleMode)}>
                        Cash: {props.data['cash']}{props.data['currency']}
                    </IonLabel>
                    <IonToggle checked={toggleMode} onIonChange={(event) => setToggleMode(event.detail.checked)}/>
                </IonItem>
                {toggleMode ?
                    <IonItem lines='none' style={{marginRight: '16px'}}
                             onClick={() => setAlertCash(true)}>
                        <IonProgressBar
                            value={props.data['sum'] === 0 ? 0 : props.data['cash'] / props.data['sum']}
                        />
                        <IonBadge slot='end'>
                            {(props.data['cash'] / props.data['sum'] * 100).toFixed(1)}
                            {props.data['sum'] === 0 ? '' : '%'}
                        </IonBadge>
                    </IonItem>
                :
                    <IonItem lines='none' style={{marginRight: '16px'}}>
                        <IonProgressBar
                            value={0.5}
                        />
                        <IonBadge color='medium' slot='end'>
                            wip...
                        </IonBadge>
                    </IonItem>
                }
            </IonCard>
            <IonList>
                {props.data['assets'] && props.data['assets'].map((value:AssetDTO, index:number) =>
                    <IonItem key={index} onClick={() => setTemp(index)} style={{marginRight: '16px'}}>
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>{value['name']}</IonLabel>
                                </IonCol>
                                <IonCol size='auto' style={{maxWidth: '30%'}}>
                                    <IonLabel class='ion-text-center' style={{fontSize: '0.8em', marginTop: '4px'}}>
                                        {value['amount']}@{value['price']}{props.data['currency']}
                                    </IonLabel>
                                </IonCol>
                                <IonCol>
                                    <IonLabel class='ion-text-right'>
                                        {value['amount'] * value['price']}{props.data['currency']}
                                    </IonLabel>
                                </IonCol>
                            </IonRow>
                            {toggleMode ?
                                <IonRow>
                                    <IonCol>
                                        <IonProgressBar style={{marginTop: '8px'}}
                                            value={value['amount'] * value['price'] / props.data['sum']}
                                        />
                                    </IonCol>
                                    <IonCol size='auto'>
                                        <IonBadge style={{marginLeft: '20px'}}>
                                            {(100 * value['amount'] * value['price'] / props.data['sum'])
                                                .toFixed(1)}%
                                        </IonBadge>
                                    </IonCol>
                                </IonRow>
                            :
                                <IonRow>
                                    <IonCol>
                                        <IonRange class='ion-no-padding' color='dark'
                                                  value={value['target']} min={0} max={100}
                                                  onIonChange={(event) => setTarget(event.detail.value as number, index)}
                                        />
                                    </IonCol>
                                    <IonCol size='auto'>
                                        <IonBadge color='medium' style={{marginLeft: '20px'}}>
                                            {value['target']}%
                                        </IonBadge>
                                    </IonCol>
                                </IonRow>
                            }
                        </IonGrid>
                    </IonItem>
                )}
            </IonList>
            <IonFab vertical='bottom' horizontal='end' slot='fixed'>
                <IonFabButton onClick={() => setAlertAddAsset(true)}>
                    <IonIcon icon={add}/>
                </IonFabButton>
            </IonFab>
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
                        handler: (data) => {editCash(data)}
                    }, 'Cancel'
                ]}
            />
            <IonAlert
                isOpen={alertEditAsset}
                onDidDismiss={() => setTemp(-1)}
                header={'Edit Position'}
                inputs={[
                    {
                        name: 'name',
                        type: 'text',
                        value: temp >= 0 ? props.data['assets'][temp]['name'] : '',
                        placeholder: 'Name of the asset'
                    }, {
                        name: 'amount',
                        type: 'number',
                        value: temp >= 0 ? props.data['assets'][temp]['amount'] : 0,
                        placeholder: 'Amount you hold'
                    }, {
                        name: 'price',
                        type: 'number',
                        value: temp >= 0 ? props.data['assets'][temp]['price'] : 0,
                        placeholder: 'Price you paid'
                    }
                ]}
                buttons={[
                    {
                        text: 'Confirm',
                        handler: (data) => {editAsset(data)}
                    }, 'Cancel'
                ]}
            />
            <IonAlert
                isOpen={alertAddAsset}
                onDidDismiss={() => setAlertAddAsset(false)}
                header={'Add New Position'}
                inputs={[
                    {
                        name: 'name',
                        type: 'text',
                        placeholder: 'Name of the asset'
                    }, {
                        name: 'amount',
                        type: 'number',
                        placeholder: 'Amount you hold'
                    }, {
                        name: 'price',
                        type: 'number',
                        placeholder: 'Price you paid'
                    }
                ]}
                buttons={[
                    {
                        text: 'Confirm',
                        handler: (data) => {addAsset(data)}
                    }, 'Cancel'
                ]}
            />
        </IonContent>
    );
};

export default Balance;
