// envUtils.ts
declare global {
    interface Window {
        env: {
            REACT_APP_SERVER_URL: string;
            REACT_APP_BREVO_API_KEY: string;
            REACT_APP_BREVO_EMAIL: string;
            REACT_APP_BREVO_NAME: string;
            REACT_APP_FIREBASE_APIKEY: string;
            REACT_APP_FIREBASE_AUTHDOMAIN: string;
            REACT_APP_FIREBASE_PROJECTID: string;
            REACT_APP_FIREBASE_STORAGEBUCKET: string;
            REACT_APP_FIREBASE_MESSAGINGSENDERID: string;
            REACT_APP_FIREBASE_APPID: string;
            REACT_APP_FIREBASE_MEASUREMENTID: string;
        };
    }
}

export const getEnvVariable = (key: keyof Window['env']): string | null => {
    if (process.env[key]) {
        return process.env[key] as string;
    }

    if (window?.env?.[key]) {
        return window.env[key];
    }

    throw new Error(`${key} is not defined in process.env or window.env`);
};