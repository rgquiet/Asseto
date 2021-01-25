import { IonModal, IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { FilesystemEncoding, FilesystemDirectory, Plugins } from '@capacitor/core';
import React, { useState } from 'react';
import './Home.css';

const { Filesystem } = Plugins;

const Home: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [files, setFiles] = useState(['']);

    const writeHandler = () => {
        const fileName = 'Download/' + new Date().getTime() + '.txt';
        Filesystem.writeFile({
            path: fileName,
            data: 'Hello World',
            directory: FilesystemDirectory.ExternalStorage,
            encoding: FilesystemEncoding.UTF8
        }).then(uri => console.log(uri));
    }

    const readHandler = () => {
        Filesystem.readdir({
            path: '',
            directory: FilesystemDirectory.ExternalStorage
        }).then(r => {
            setFiles(r.files);
            setShowModal(true);
        });
    }

    const openFile = () => {
        /* wip:
        https://capacitorjs.com/docs/apis/filesystem
        https://stackoverflow.com/questions/62444931/capacitor-write-files-to-download-folder
        */
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Test: Filesystem</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent class='ion-padding' fullscreen>
                <IonButton onClick={writeHandler}>Write</IonButton>
                <IonButton onClick={readHandler}>Read</IonButton>
                <IonModal isOpen={showModal}>
                    <h2>Choose a file</h2>
                    {files.map((file, i) => (
                        <p>{i}: {file}</p>
                    ))}
                    <IonButton onClick={() => setShowModal(false)}>Exit</IonButton>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Home;
