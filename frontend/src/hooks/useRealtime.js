import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';

// Helper to init firebase safely
const initFirebase = () => {
    const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

    if (!firebaseConfig.apiKey) {
        console.warn("Firebase config missing. Realtime updates disabled.");
        return null;
    }

    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApps()[0];
};

export const useRealtime = (path, onData) => {
    const [data, setData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const app = initFirebase();
        if (!app) {
            // If no firebase, strictly simulation/dev mode logic could go here
            return;
        }

        const db = getDatabase(app);
        const dataRef = ref(db, path);

        const handleData = (snapshot) => {
            const val = snapshot.val();
            setData(val);
            if (onData) onData(val);
            setIsConnected(true);
        };

        onValue(dataRef, handleData, (error) => {
            console.error("Firebase read failed", error);
            setIsConnected(false);
        });

        return () => {
            off(dataRef, handleData);
        };
    }, [path]);

    return { data, isConnected };
};
