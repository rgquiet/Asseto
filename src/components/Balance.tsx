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
    const [temp, setTemp] = useState<number>(-1);
    const [toggleMode, setToggleMode] = useState<boolean>(true);
    const [alertCash, setAlertCash] = useState<boolean>(false);
    const [alertEditAsset, setAlertEditAsset] = useState<boolean>(false);
    const [alertNewAsset, setAlertNewAsset] = useState<boolean>(false);

    useEffect(() => {
        if(temp === -1) {
            setAlertEditAsset(false);
        } else {
            if(toggleMode) {
                setAlertEditAsset(true);
            } else {
                setTemp(-1);
            }
        }
    }, [temp, toggleMode]);

    const editCash = (data:any) => {
        if(data['currency'].replace(/\s/g, '') !== '' && data['cash'] >= 0) {
            props.data['currency'] = data['currency'].trim();
            if(data['cash'] === '') {
                props.data['cash'] = 0;
            } else {
                props.data['cash'] = parseFloat(data['cash']);
            }
        }
    }

    const editAsset = (data:any) => {
        if(data['name'].replace(/\s/g, '') !== '' && data['amount'] > 0 && data['price'] > 0) {
            const array:AssetDTO[] = [...props.data['assets']];
            array[temp] = new AssetDTO(
                data['name'].trim(),
                parseFloat(data['amount']),
                parseFloat(data['price']),
                props.data['assets'][temp]['target']
            );
            props.data['assets'] = array;
        }
    }

    const newAsset = (data:any) => {
        if(data['name'].replace(/\s/g, '') !== '' && data['amount'] > 0 && data['price'] > 0) {
            props.data['assets'] = [...props.data['assets'], new AssetDTO(
                data['name'].trim(),
                parseFloat(data['amount']),
                parseFloat(data['price']),
                0
            )];
        }
    }

    const deleteAsset = () => {
        const array:AssetDTO[] = [...props.data['assets']];
        array.splice(temp, 1);
        props.data['assets'] = array;
    }

    const setTarget = (target:number, index:number) => {
        let targetSum:number = 0;
        props.data['assets'].forEach((dto:AssetDTO, i:number) => {
            if(i !== index) {
                targetSum += dto['target'];
            }
        });
        if(targetSum + target <= 100) {
            props.data['assets'][index]['target'] = target;
        } else {
            props.data['assets'][index]['target'] = 100 - targetSum;
        }
        setTemp(index);
    }

    const calculateCashTarget = () => {
        let targetSum:number = 100;
        props.data['assets'].forEach((dto:AssetDTO) => {
            targetSum -= dto['target'];
        });
        return targetSum;
    }

    return (
        <IonContent class='ion-padding'>
            <IonCard>
                <IonItem style={{marginRight: '16px'}}>
                    <IonLabel onClick={() => setAlertCash(toggleMode)}>
                        Cash: {toggleMode ?
                            props.data['cash'] + props.data['currency']
                        :
                            (props.data['sum'] * calculateCashTarget() / 100)
                            .toFixed(2) + props.data['currency']
                        }
                    </IonLabel>
                    {!toggleMode && <div>
                        {props.data['sum'] * calculateCashTarget() / 100 - props.data['cash'] >= 0 ?
                            <IonLabel color='success' style={{fontSize: '0.8em', marginTop: '4px'}}>
                                {(props.data['sum'] * calculateCashTarget() / 100 - props.data['cash'])
                                .toFixed(2)}
                            </IonLabel>
                        :
                            <IonLabel color='danger' style={{fontSize: '0.8em', marginTop: '4px'}}>
                                {(props.data['sum'] * calculateCashTarget() / 100 - props.data['cash'])
                                .toFixed(2)}
                            </IonLabel>
                        }
                    </div>}
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
                        <IonProgressBar color='dark'
                            value={calculateCashTarget() / 100}
                        />
                        <IonBadge color='medium' slot='end'>
                            {calculateCashTarget()}%
                        </IonBadge>
                    </IonItem>
                }
            </IonCard>
            <IonList>
                {props.data['assets'] && props.data['assets'].map((dto:AssetDTO, index:number) =>
                    <IonItem key={index} onClick={() => setTemp(index)} style={{marginRight: '16px'}}>
                        <IonGrid>
                            <IonRow>
                                <IonCol>
                                    <IonLabel>{dto['name']}</IonLabel>
                                </IonCol>
                                <IonCol size='auto' style={{maxWidth: '30%'}}>
                                    {toggleMode ?
                                        <IonLabel class='ion-text-center'
                                                  style={{fontSize: '0.8em', marginTop: '4px'}}>
                                            {dto['amount']}@{dto['price']}{props.data['currency']}
                                        </IonLabel>
                                    :
                                        <div>
                                            {props.data['sum'] * dto['target'] / 100
                                            - dto['amount'] * dto['price'] >= 0 ?
                                                <IonLabel class='ion-text-center' color='success'
                                                          style={{fontSize: '0.8em', marginTop: '4px'}}>
                                                    {(props.data['sum'] * dto['target'] / 100
                                                    - dto['amount'] * dto['price']).toFixed(2)}
                                                </IonLabel>
                                            :
                                                <IonLabel class='ion-text-center' color='danger'
                                                          style={{fontSize: '0.8em', marginTop: '4px'}}>
                                                    {(props.data['sum'] * dto['target'] / 100
                                                    - dto['amount'] * dto['price']).toFixed(2)}
                                                </IonLabel>
                                            }
                                        </div>
                                    }
                                </IonCol>
                                <IonCol>
                                    <IonLabel class='ion-text-right'>
                                        {toggleMode ?
                                            (dto['amount'] * dto['price']).toFixed(2)
                                            + props.data['currency']
                                        :
                                            (props.data['sum'] * dto['target'] / 100).toFixed(2)
                                            + props.data['currency']
                                        }
                                    </IonLabel>
                                </IonCol>
                            </IonRow>
                            {toggleMode ?
                                <IonRow>
                                    <IonCol>
                                        <IonProgressBar style={{marginTop: '8px'}}
                                            value={dto['amount'] * dto['price'] / props.data['sum']}
                                        />
                                    </IonCol>
                                    <IonCol size='auto'>
                                        <IonBadge style={{marginLeft: '20px'}}>
                                            {(100 * dto['amount'] * dto['price'] / props.data['sum'])
                                            .toFixed(1)}%
                                        </IonBadge>
                                    </IonCol>
                                </IonRow>
                            :
                                <IonRow>
                                    <IonCol style={{paddingTop: 0, paddingBottom: 0}}>
                                        <IonRange class='ion-no-padding' color='dark'
                                            value={dto['target']} min={0} max={100}
                                            onIonChange={(event) => setTarget(
                                                event.detail.value as number, index
                                            )}
                                        />
                                    </IonCol>
                                    <IonCol size='auto'>
                                        <IonBadge color='medium' style={{marginLeft: '20px'}}>
                                            {dto['target']}%
                                        </IonBadge>
                                    </IonCol>
                                </IonRow>
                            }
                        </IonGrid>
                    </IonItem>
                )}
            </IonList>
            <IonFab vertical='bottom' horizontal='end' slot='fixed'>
                <IonFabButton onClick={() => setAlertNewAsset(true)}>
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
                    }, {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'cus-dark'
                    }
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
                    }, {
                        text: 'Delete',
                        cssClass: 'cus-danger',
                        handler: () => {deleteAsset()}
                    }
                ]}
            />
            <IonAlert
                isOpen={alertNewAsset}
                onDidDismiss={() => setAlertNewAsset(false)}
                header={'New Position'}
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
                        handler: (data) => {newAsset(data)}
                    }, {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'cus-dark'
                    }
                ]}
            />
        </IonContent>
    );
};

export default Balance;
