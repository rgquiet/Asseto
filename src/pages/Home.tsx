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
import PortfolioDTO from '../dto/PortfolioDTO';
import './Home.css';

const { Filesystem } = Plugins;

const Home:React.FC = () => {
    const [portfolio, setPortfolio] = useState<PortfolioDTO>(new PortfolioDTO(''));
    const [portfolioNames, setPortfolioNames] = useState<string[]>([]);
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
            setPortfolioNames(allPortfolios);
        });
    }, []);

    const showPortfolio = (name:string) => {
        readFile(name);
        setModalPortfolio(true);
    }

    const closePortfolio = () => {
        setModalPortfolio(false);
        setPortfolio(new PortfolioDTO(''));
    }

    const createPortfolio = (name:string) => {
        if(name !== '') {
            if(portfolioNames.includes(name)) {
                setPortfolio(new PortfolioDTO(name));
                setAlertReplace(true);
            } else {
                createFile(name);
            }
        }
    }

    const createFile = (name:string) => {
        Filesystem.writeFile({
            path: name + '.json',
            data: JSON.stringify(new PortfolioDTO(name)),
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8
        }).then(() => {
            if(portfolio['name'] !== name) {
                setPortfolioNames([name, ...portfolioNames]);
            }
            setPortfolio(new PortfolioDTO(''));
        });
    }

    const readFile = (name:string) => {
        Filesystem.readFile({
            path: name + '.json',
            directory: FilesystemDirectory.Data
        }).then((result) => {
            setPortfolio(JSON.parse(result.data));
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
                    {portfolioNames.map((value:string, index:number) =>
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
                            <IonTitle class='ion-text-center'>{portfolio['name']}</IonTitle>
                            <IonButtons slot='secondary'>
                                <IonButton onClick={() => console.log('wip: Save changes in portfolio')}>
                                    <IonIcon slot='icon-only' icon={saveOutline}/>
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <Balance data={portfolio}/>
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
                            handler: (data) => {createPortfolio(data.name)}
                        }, 'Cancel'
                    ]}
                />
                <IonAlert
                    isOpen={alertReplace}
                    onDidDismiss={() => setAlertReplace(false)}
                    header={'Warning'}
                    message={
                        'There is already a portfolio with the name ' +
                        portfolio['name'] +
                        '! Do you want to replace it?'
                    }
                    buttons={[
                        {
                            text: 'Yes',
                            handler: () => {createFile(portfolio['name'])}
                        }, 'No'
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default Home;
