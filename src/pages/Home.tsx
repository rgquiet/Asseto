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
    IonFooter,
    IonHeader,
    IonPage
} from '@ionic/react';
import { addOutline, arrowBackOutline, saveOutline } from 'ionicons/icons';
import { FilesystemDirectory, FilesystemEncoding, Plugins } from '@capacitor/core';
import React, { useState, useCallback, useEffect } from 'react';
import Currency from '../components/Currency';
import Balance from '../components/Balance';
import Portfolio from '../components/Portfolio';
import PortfolioDTO from '../dto/PortfolioDTO';
import OverviewDTO from '../dto/OverviewDTO';
import AssetoDTO from '../dto/AssetoDTO';
import './Home.css';

const { Filesystem } = Plugins;

const Home:React.FC = () => {
    const [asseto, setAsseto] = useState<AssetoDTO>(new AssetoDTO());
    const [portfolio, setPortfolio] = useState<PortfolioDTO>(new PortfolioDTO(''));
    const [modalPortfolio, setModalPortfolio] = useState<boolean>(false);
    const [modalCurrency, setModalCurrency] = useState<boolean>(false);
    const [toastSave, setToastSave] = useState<boolean>(false);
    const [alertNew, setAlertNew] = useState<boolean>(false);
    const [alertReplace, setAlertReplace] = useState<boolean>(false);
    const [alertEdit, setAlertEdit] = useState<boolean>(false);

    const initAsseto = useCallback(() => {
        saveAsseto().then(() => {
            Filesystem.readdir({
                path: '',
                directory: FilesystemDirectory.Data
            }).then((dir) => {
                const array:OverviewDTO[] = asseto['overview'];
                dir.files.forEach((name:string, index:number, names:string[]) => {
                    if(name !== 'asseto.json') {
                        Filesystem.readFile({
                            path: name,
                            directory: FilesystemDirectory.Data,
                            encoding: FilesystemEncoding.UTF8
                        }).then((result) => {
                            const dto:PortfolioDTO = new PortfolioDTO('');
                            dto.init(JSON.parse(result.data));
                            array.push(new OverviewDTO(
                                dto['name'],
                                dto['currency'],
                                dto['sum']
                            ));
                            if(index === names.length - 2) {
                                asseto['overview'] = array;
                                const dto:AssetoDTO = new AssetoDTO();
                                dto.init(asseto);
                                setAsseto(dto);
                                saveAsseto();
                            }
                        });
                    }
                });
            });
        });
    }, []);

    useEffect(() => {
        Filesystem.readFile({
            path: 'asseto.json',
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8
        }).then((result) => {
            const dto:AssetoDTO = new AssetoDTO();
            dto.init(JSON.parse(result.data));
            setAsseto(dto);
        }).catch(() => {
            initAsseto();
        });
    }, [initAsseto]);

    const checkName = (name:string) => {
        name = name.replace(/[^a-zA-Z ]/g, '').trim();
        if(name !== '' && name !== 'asseto') {
            return name;
        }
        return '_false';
    }

    const findOverviewByName = (name:string) => {
        for(let index in asseto['overview']) {
            if(asseto['overview'][index]['name'] === name) {
                return Number(index);
            }
        }
        return -1;
    }

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

    const renamePortfolio = (name:string) => {
        name = checkName(name);
        if(name !== '_false' && findOverviewByName(name) === -1) {
            deleteFile(portfolio['name']).then(() => {
                asseto['overview'].splice(findOverviewByName(portfolio['name']), 1);
                portfolio['name'] = name;
                saveFile(portfolio['name']).then(() => {
                    asseto['overview'].push(new OverviewDTO(
                        portfolio['name'],
                        portfolio['currency'],
                        portfolio['sum']
                    ));
                    saveAsseto();
                    setPortfolio(new PortfolioDTO(''));
                });
            });
        }
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

    const deletePortfolio = () => {
        deleteFile(portfolio['name']).then(() => {
            const index:number = findOverviewByName(portfolio['name']);
            const array:OverviewDTO[] = asseto['overview'];
            array.splice(index, 1);
            asseto['overview'] = array;
            saveAsseto();
            setPortfolio(new PortfolioDTO(''));
        });
    }

    const savePortfolio = () => {
        saveFile(portfolio['name']).then(() => {
            const index:number = findOverviewByName(portfolio['name']);
            const array:OverviewDTO[] = asseto['overview'];
            array[index] = new OverviewDTO(
                portfolio['name'],
                portfolio['currency'],
                portfolio['sum']
            );
            asseto['overview'] = array;
            saveAsseto().then(() => {
                setToastSave(true);
            });
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
                asseto['overview'].push(new OverviewDTO(name, '$', 0));
            } else {
                const index:number = findOverviewByName(name);
                const array:OverviewDTO[] = asseto['overview'];
                array[index] = new OverviewDTO(name, '$', 0);
                asseto['overview'] = array;
            }
            saveAsseto();
            setPortfolio(new PortfolioDTO(''));
        });
    }

    const deleteFile = async (name:string) => {
        return await Filesystem.deleteFile({
            path: name + '.json',
            directory: FilesystemDirectory.Data
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

    const saveAsseto = async () => {
        return await Filesystem.writeFile({
            path: 'asseto.json',
            data: JSON.stringify(asseto),
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8
        });
    }

    const updateAsseto = (dto:AssetoDTO) => {
        setAsseto(dto);
    }

    const closeCurrency = () => {
        setModalCurrency(false);
        saveAsseto();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonLabel slot='start' style={{width: '52px'}}/>
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
                    {asseto['overview'].map((dto:OverviewDTO, index:number) =>
                        <Portfolio key={index} portfolio={showPortfolio} setting={showSetting}
                                   name={dto['name']} currency={dto['currency']} sum={dto['sum']}/>
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
                <IonModal isOpen={modalCurrency}>
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot='start'>
                                <IonButton onClick={closeCurrency}>
                                    <IonIcon slot='icon-only' icon={arrowBackOutline}/>
                                </IonButton>
                            </IonButtons>
                            <IonTitle class='ion-text-center'>
                                Edit Currency Rate
                            </IonTitle>
                            <IonLabel slot='end' style={{width: '52px'}}/>
                        </IonToolbar>
                    </IonHeader>
                    <Currency data={asseto} handler={updateAsseto}/>
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
            <IonFooter>
                <IonToolbar>
                    <IonTitle class='ion-text-center' onClick={() => setModalCurrency(true)}>
                        {asseto['total']}{asseto['main']}
                    </IonTitle>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default Home;
