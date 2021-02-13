import {
    IonLabel,
    IonTitle,
    IonImg,
    IonIcon,
    IonButton,
    IonButtons,
    IonList,
    IonToast,
    IonAlert,
    IonModal,
    IonContent,
    IonToolbar,
    IonHeader,
    IonPage
} from '@ionic/react';
import { addOutline, arrowBackOutline, saveOutline } from 'ionicons/icons';
import { FilesystemDirectory, FilesystemEncoding, Plugins } from '@capacitor/core';
import React, { useState, useEffect } from 'react';
import Balance from '../components/Balance';
import Portfolio from '../components/Portfolio';
import PortfolioDTO from '../dto/PortfolioDTO';
import OverviewDTO from '../dto/OverviewDTO';
import './Home.css';

const { Filesystem } = Plugins;

const Home:React.FC = () => {
    const [overview, setOverview] = useState<OverviewDTO[]>([]);
    const [portfolio, setPortfolio] = useState<PortfolioDTO>(new PortfolioDTO(''));
    const [modalPortfolio, setModalPortfolio] = useState<boolean>(false);
    const [toastSave, setToastSave] = useState<boolean>(false);
    const [alertNew, setAlertNew] = useState<boolean>(false);
    const [alertReplace, setAlertReplace] = useState<boolean>(false);
    const [alertEdit, setAlertEdit] = useState<boolean>(false);

    useEffect(() => {
        Filesystem.readFile({
            path: 'asseto.json',
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8
        }).then((result) => {
            setOverview(JSON.parse(result.data));
        }).catch(() => {
            saveOverview().then(() => {
                // wip: Init overview with all existing files
            });
        });
    }, []);

    const showSetting = (name:string) => {
        readFile(name).then(() => {
            setAlertEdit(true);
        });
    }

    const showPortfolio = (name:string) => {
        readFile(name).then(() => {
            setModalPortfolio(true);
        });
    }

    const closePortfolio = () => {
        setModalPortfolio(false);
        setPortfolio(new PortfolioDTO(''));
    }

    const createPortfolio = (name:string) => {
        name = checkName(name);
        if(name !== '_false') {
            if(findOverviewByName(name) !== -1) {
                setPortfolio(new PortfolioDTO(name));
                setAlertReplace(true);
            } else {
                createFile(name);
            }
        }
    }

    const savePortfolio = () => {
        saveFile(portfolio['name']).then(() => {
            let index:number = findOverviewByName(portfolio['name']);
            overview[index] = new OverviewDTO(
                portfolio['name'],
                portfolio['currency'],
                portfolio['sum']
            );
            saveOverview().then(() => {
                setToastSave(true);
            }).catch(() => {
                // wip...
            });
        });
    }

    const deletePortfolio = () => {
        deleteFile(portfolio['name']).then(() => {
            let index:number = findOverviewByName(portfolio['name']);
            overview.splice(index, 1);
            saveOverview().catch(() => {
                // wip...
            });
            setPortfolio(new PortfolioDTO(''));
        });
    }

    const renamePortfolio = (name:string) => {
        name = checkName(name);
        if(name !== '_false' && findOverviewByName(name) === -1) {
            deleteFile(portfolio['name']).then(() => {
                overview.splice(findOverviewByName(portfolio['name']), 1);
                portfolio['name'] = name;
                saveFile(portfolio['name']).then(() => {
                    updateOverview(new OverviewDTO(
                        portfolio['name'],
                        portfolio['currency'],
                        portfolio['sum']
                    ));
                    setPortfolio(new PortfolioDTO(''));
                });
            });
        }
    }

    const checkName = (name:string) => {
        name = name.replace(/[^a-zA-Z ]/g, '').trim();
        if(name !== '' && name !== 'asseto') {
            return name;
        }
        return '_false';
    }

    const findOverviewByName = (name:string) => {
        for(let index in overview) {
            if(overview[index]['name'] === name) {
                return Number(index);
            }
        }
        return -1;
    }

    const updateOverview = (dto:OverviewDTO) => {
        const array:OverviewDTO[] = overview;
        array.push(dto);
        setOverview(array);
        saveOverview().catch(() => {
            // wip...
        });
    }

    const saveOverview = async () => {
        return await Filesystem.writeFile({
            path: 'asseto.json',
            data: JSON.stringify(overview),
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8
        });
    }

    const readFile = async (name:string) => {
        return await Filesystem.readFile({
            path: name + '.json',
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8
        }).then((result) => {
            const dto:PortfolioDTO = new PortfolioDTO('');
            dto.init(JSON.parse(result.data));
            setPortfolio(dto);
        });
    }

    const createFile = (name:string) => {
        Filesystem.writeFile({
            path: name + '.json',
            data: JSON.stringify(new PortfolioDTO(name)),
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8
        }).then(() => {
            if(portfolio['name'] !== name) {
                updateOverview(new OverviewDTO(name, '$', 0));
            } else {
                let index:number = findOverviewByName(name);
                overview[index] = new OverviewDTO(name, '$', 0);
                saveOverview().catch(() => {
                    // wip...
                });
            }
            setPortfolio(new PortfolioDTO(''));
        });
    }

    const saveFile = async (name:string) => {
        return await Filesystem.writeFile({
            path: name + '.json',
            data: JSON.stringify(portfolio),
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8
        });
    }

    const deleteFile = async (name:string) => {
        return await Filesystem.deleteFile({
            path: name + '.json',
            directory: FilesystemDirectory.Data
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
                    {overview.map((dto:OverviewDTO, index:number) =>
                        <Portfolio name={dto['name']} key={index}
                                   portfolio={showPortfolio} setting={showSetting}/>
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
                            <IonTitle class='ion-text-center'>
                                {portfolio['name']}: {portfolio['sum']}{portfolio['currency']}
                            </IonTitle>
                            <IonButtons slot='secondary'>
                                <IonButton onClick={savePortfolio}>
                                    <IonIcon slot='icon-only' icon={saveOutline}/>
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <Balance data={portfolio}/>
                    <IonToast
                        isOpen={toastSave}
                        onDidDismiss={() => setToastSave(false)}
                        message={'Saved successfully'}
                        duration={1000}
                    />
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
                        }, {
                            text: 'Cancel',
                            role: 'cancel',
                            cssClass: 'cus-dark'
                        }
                    ]}
                />
                <IonAlert
                    isOpen={alertReplace}
                    onDidDismiss={() => setAlertReplace(false)}
                    header={'Warning'}
                    message={
                        'There is already a portfolio with the name <strong>' +
                        portfolio['name'] +
                        '</strong>! Do you want to replace it?'
                    }
                    buttons={[
                        {
                            text: 'Yes',
                            handler: () => {createFile(portfolio['name'])}
                        }, {
                            text: 'No',
                            role: 'cancel',
                            cssClass: 'cus-dark'
                        }
                    ]}
                />
                <IonAlert
                    isOpen={alertEdit}
                    onDidDismiss={() => setAlertEdit(false)}
                    header={'Edit Portfolio'}
                    inputs={[
                        {
                            name: 'name',
                            type: 'text',
                            value: portfolio['name'],
                            placeholder: 'Enter a name...'
                        }
                    ]}
                    buttons={[
                        {
                            text: 'Rename',
                            handler: (data) => {renamePortfolio(data.name)}
                        }, {
                            text: 'Delete',
                            cssClass: 'cus-danger',
                            handler: () => {deletePortfolio()}
                        }
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default Home;
