    export type User = {
        id: string;
        name: string;
        email: string;
        phone: string;
        password: string;
        biometricEnabled: boolean;
        createdAt: string; // ISO date format
        isAuthenticated:boolean
        lastEvent:"Login"|"Logout"|"Register"|null
        lastEventTime:Date|null|string
        lastEventMessage:string
      };
      