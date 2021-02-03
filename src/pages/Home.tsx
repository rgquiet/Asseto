import {
    IonAlert,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonLabel,
    IonList,
    IonModal,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { addOutline, arrowBackOutline, saveOutline } from 'ionicons/icons';
import { FilesystemDirectory, FilesystemEncoding, Plugins } from '@capacitor/core';
import React, { useEffect, useState } from 'react';
import Balance from '../components/Balance';
import Portfolio from '../components/Portfolio';
import './Home.css';

const { Filesystem } = Plugins;

const Home:React.FC = () => {
    const [data, setData] = useState<any>({});
    const [temp, setTemp] = useState<string>('');
    const [portfolios, setPortfolios] = useState<string[]>([]);
    const [modalPortfolio, setModalPortfolio] = useState<boolean>(false);
    const [alertNew, setAlertNew] = useState<boolean>(false);
    const [alertReplace, setAlertReplace] = useState<boolean>(false);

    useEffect(() => {
        Filesystem.readdir({
            path: '',
            directory: FilesystemDirectory.Data
        }).then((dir) => {
            const allPortfolios:string[] = [];
            dir.files.forEach((name) => allPortfolios.push(name.slice(0, -5)));
            setPortfolios(allPortfolios);
        });
    }, []);

    const showPortfolio = (name:string) => {
        readFile(name);
        setTemp(name);
        setModalPortfolio(true);
    }

    const closePortfolio = () => {
        setModalPortfolio(false);
        setTemp('');
        setData({});
    }

    const createPortfolio = (name:string) => {
        if(name !== '') {
            if(portfolios.includes(name)) {
                setTemp(name);
                setAlertReplace(true);
            } else {
                writeFile(name);
            }
        }
    }

    const writeFile = (name:string) => {
        Filesystem.writeFile({
            path: name + '.json',
            data: '{ "cash" : 100, "balance" : [1, 2, 3] }',
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8
        }).then(() => {
            if(temp !== name) {
                setPortfolios([name, ...portfolios]);
            }
            setTemp('');
        });
    }

    const readFile = (name:string) => {
        Filesystem.readFile({
            path: name + '.json',
            directory: FilesystemDirectory.Data
        }).then((result) => {
            setData(JSON.parse(result.data));
        });
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonLabel slot='start' style={{width: '48px'}}/>
                    <IonImg src='assets/asseto.png' style={{width: '100%', height: '30px'}}/>
                    <IonButtons slot='secondary'>
                        <IonButton onClick={() => setAlertNew(true)}>
                            <IonIcon slot='icon-only' icon={addOutline}/>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent class='ion-padding'>
                <IonList>
                    {portfolios.map((value:string, index:number) =>
                        <Portfolio handler={showPortfolio} value={value} key={index}/>
                    )}
                </IonList>
                <IonModal isOpen={modalPortfolio}>
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot='start'>
                                <IonButton onClick={closePortfolio}>
                                    <IonIcon slot='icon-only' icon={arrowBackOutline}/>
                                </IonButton>
                            </IonButtons>
                            <IonTitle class='ion-text-center'>{temp}</IonTitle>
                            <IonButtons slot='secondary'>
                                <IonButton onClick={() => console.log('wip: Save changes in portfolio')}>
                                    <IonIcon slot='icon-only' icon={saveOutline}/>
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent class='ion-padding'>
                        <Balance data={data}/>
                    </IonContent>
                </IonModal>
                <IonAlert
                    isOpen={alertNew}
                    onDidDismiss={() => setAlertNew(false)}
                    header={'New Portfolio'}
                    inputs={[
                        {
                            name: 'name',
                            type: 'text',
                            placeholder: 'Enter a name...'
                        }
                    ]}
                    buttons={[
                        {
                            text: 'Create',
                            handler: (data) => {
                                createPortfolio(data.name)
                            }
                        },
                        'Cancel'
                    ]}
                />
                <IonAlert
                    isOpen={alertReplace}
                    onDidDismiss={() => setAlertReplace(false)}
                    header={'Warning'}
                    message={'There is already a portfolio with the name ' + temp + '! Do you want to replace it?'}
                    buttons={[
                        {
                            text: 'Yes',
                            handler: () => {
                                writeFile(temp)
                            }
                        },
                        'No'
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default Home;
