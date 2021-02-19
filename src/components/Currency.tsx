import {
    IonCard,
    IonInput,
    IonItem,
    IonList,
    IonContent
} from '@ionic/react';
import React from 'react';
import CurrencyDTO from '../dto/CurrencyDTO';
import AssetoDTO from '../dto/AssetoDTO';

const Currency = (props:any) => {

    const setMain = (main:string) => {
        main = main.trim();
        if(main !== '') {
            props.data['main'] = main;
            updateAsseto();
        }
    }

    const setFactor = (factor:number, index:number) => {
        if(factor > 0) {
            const array:CurrencyDTO[] = props.data['other'];
            array[index]['factor'] = factor;
            props.data['other'] = array;
            updateAsseto();
        }
    }

    const updateAsseto = () => {
        const dto:AssetoDTO = new AssetoDTO();
        dto.init(props.data);
        props.handler(dto);
    }

    return (
        <IonContent class='ion-padding'>
            <IonCard>
                <IonItem lines='none' style={{marginRight: '16px'}}>
                    Your currency:&nbsp;
                    <IonInput type='text' value={props.data['main']}
                              onIonChange={(event) => setMain(event.detail.value!)}
                    />
                </IonItem>
            </IonCard>
            <IonList>
                {props.data['other'] && props.data['other'].map((dto:CurrencyDTO, index:number) =>
                    <IonItem key={index} lines='none' style={{marginRight: '16px', left: '-14px'}}>
                        <IonCard style={{width: '50%', paddingLeft: '5px'}}>
                            <IonInput type='number' value={dto['factor']}
                                      onIonChange={(event) => setFactor(
                                          parseFloat(event.detail.value!), index
                                      )}
                            />
                        </IonCard>
                        {dto['symbol']}
                    </IonItem>
                )}
            </IonList>
        </IonContent>
    );
};

export default Currency;
