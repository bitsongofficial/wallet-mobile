type Currency = {
  _id: number;
  name: string;
  title: string;
};

export type NotifSettings = {
  enable: boolean;
  history: 10;
};

export type PinSettings = {
  enable: boolean;
  pin: string | null;
  biometric_enable: boolean;
};

export type CheckMethod = "FaceID" | "TouchID";
